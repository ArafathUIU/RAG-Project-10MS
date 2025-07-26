# RAG-Project-10MS

## ⚙️ Setup Instructions

```bash
git clone https://github.com/yourusername/RAG-Project-10MS.git
cd RAG-Project-10MS
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py


##install Dependencies
pip install transformers sentence-transformers faiss-cpu langchain


| Component             | Library/Tool                                             |
| --------------------- | -------------------------------------------------------- |
| **Text Extraction**   | `PyPDF2` / `pdfplumber` (or direct `.txt`)               |
| **Chunking**          | `langchain.text_splitter.RecursiveCharacterTextSplitter` |
| **Embeddings**        | `sentence-transformers/all-MiniLM-L6-v2` (HuggingFace)   |
| **Similarity Search** | `FAISS`                                                  |
| **QA Model**          | `google/flan-t5-base`                                    |


##Project Pipeline

Extract text from PDF or .txt.

Chunk text using Recursive Character Splitter (chunk size = 500 chars, overlap = 50).

Generate embeddings for chunks using sentence-transformers/all-MiniLM-L6-v2.

Store embeddings in FAISS index.

Retrieve top-k chunks for a user query.

Answer the question using FLAN-T5 with the retrieved context.

Mandatory Questions & Answers
1. What method or library did you use to extract the text, and why? Did you face any formatting challenges with the PDF content?
Method: Used PyPDF2 or pre-extracted .txt file for clean text.

Challenges: PDF text sometimes had line breaks, page numbers, and special characters. Preprocessing was done to normalize spacing.

2. What chunking strategy did you choose and why?
Strategy: RecursiveCharacterTextSplitter (LangChain) with chunk_size=500, chunk_overlap=50.

Reason: Recursive splitting ensures logical breaks (paragraph → sentence → word) for semantic meaning preservation.

3. What embedding model did you use? Why did you choose it?
Model: sentence-transformers/all-MiniLM-L6-v2.

Reason: Lightweight, fast, and optimized for semantic similarity. It captures contextual meaning, not just word-level similarity.

4. How are you comparing the query with your stored chunks?
Method: FAISS IndexFlatL2 (cosine similarity on normalized vectors).

Reason: FAISS is efficient for large-scale vector search.

5. How do you ensure meaningful comparison? What if the query is vague?
Used dense embeddings from a transformer-based model, which captures semantic similarity.

If the query is vague, retrieval may fetch irrelevant chunks → can improve by:

Increasing k (more chunks)

Using hybrid search (BM25 + embeddings)

Query rephrasing with LLM.

6. Do the results seem relevant? If not, what might improve them?
Results are mostly relevant.

##Improvements:

Better chunking (semantic-based)

Larger model for embeddings (e.g., mpnet-base-v2)

Context filtering using re-ranking models.

✅ Future Enhancements
✔ Add Streamlit UI
✔ Deploy as Flask/FastAPI Service
✔ Implement Hybrid Search (BM25 + FAISS)
✔ Multi-turn conversation support

✅ Sample Run Command
nginx
Copy
Edit
python app.py
Or open in Google Colab and run all cells.

Author
Developed for Bangla & English RAG-based QA System.

yaml
Copy
Edit






