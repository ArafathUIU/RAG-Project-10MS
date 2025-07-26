from flask import Flask, request, render_template, jsonify
import pandas as pd
import torch
import faiss
import numpy as np
from transformers import AutoTokenizer, AutoModel
import openai
import pickle
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables. Please set it in .env file.")

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load CSV knowledge base
excel_path = r"C:\xampp\htdocs\10MS-Assessment\RAG-Project-10MS\knowledge base\CleanExcel.xlsx"
if not os.path.exists(excel_path):
    raise FileNotFoundError(f"CSV file not found at {excel_path}")
try:
    df = pd.read_excel(excel_path)
    if 'Text' not in df.columns:
        raise ValueError(f"excel at {excel_path} must contain a 'Text' column")
except Exception as e:
    raise ValueError(f"Failed to load excel at {excel_path}: {e}")

# Load Sentence Transformer model
embedding_tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
embedding_model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2").to(device)

# Load FAISS index and saved article embeddings
embeddings_path = r"C:\xampp\htdocs\10MS-Assessment\RAG-Project-10MS\knowledge base\embedding.pkl"
if not os.path.exists(embeddings_path):
    raise FileNotFoundError(f"Embeddings file not found at {embeddings_path}")
try:
    with open(embeddings_path, "rb") as f:
        article_embeddings = pickle.load(f)
except Exception as e:
    raise ValueError(f"Failed to load embeddings at {embeddings_path}: {e}")

dimension = len(article_embeddings[0])
index = faiss.IndexFlatL2(dimension)
index.add(np.array(article_embeddings))

# ---------------------- Embedding Function ----------------------
def generate_embeddings(text):
    inputs = embedding_tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=512
    ).to(device)

    with torch.no_grad():
        outputs = embedding_model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()

# ---------------------- Document Retrieval ----------------------
def retrieve_documents(query_embedding, k=3):
    distances, indices = index.search(np.array([query_embedding]), k)
    return indices[0]

# ---------------------- Context Processing ----------------------
def process_context(docs, max_tokens=1536):
    processed_docs = []
    total_tokens = 0
    for doc in docs:
        tokens = len(doc.split())
        if total_tokens + tokens <= max_tokens:
            processed_docs.append(doc)
            total_tokens += tokens
        else:
            break
    return "\n".join(f"- {doc}" for doc in processed_docs)

# ---------------------- GPT-4 Answer Generation ----------------------
def generate_answer_with_gpt4(question, context, max_tokens=300):
    prompt = f"""
Use the following context to answer the question. If the context is insufficient, say:
"Sorry, I don't have enough information to answer that yet."

Question: {question}

Context:
{context}
"""

    messages = [
        {"role": "system", "content": "You are an expert teacher.Understand the question and based on the question find out the answer. Based on the following context, provide a concise and accurate answer to the query in 1 sentence or 2. Cite relevant details from the context and ensure clarity."},
        {"role": "user", "content": prompt}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=max_tokens
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print(f"Error generating response with GPT-4: {e}")
        return "Sorry, an error occurred while generating the response."

# ---------------------- Flask Routes ----------------------
@app.route("/", methods=["GET", "POST"])
def chat():
    if request.method == "POST":
        user_question = request.form.get("user_message", "")

        if not user_question.strip():
            return jsonify({'response': "Please enter a valid question."})

        try:
            # 1. Embed user question
            question_embedding = generate_embeddings(user_question)

            # 2. Retrieve top documents
            retrieved_indices = retrieve_documents(question_embedding, k=3)
            retrieved_articles = [df['Text'][idx] for idx in retrieved_indices if idx < len(df)]

            # 3. Build context string
            final_context = process_context(retrieved_articles)

            # 4. Ask GPT-4 with context
            bot_answer = generate_answer_with_gpt4(user_question, final_context)

            return jsonify({'response': bot_answer})
        except Exception as e:
            print(f"Error processing query: {e}")
            return jsonify({'response': f"Sorry, an error occurred: {str(e)}"})

    return render_template("index.html")

# ---------------------- Run Server ----------------------
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)