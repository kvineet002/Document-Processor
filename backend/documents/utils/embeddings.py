from sentence_transformers import SentenceTransformer

embedding_model = SentenceTransformer("intfloat/e5-small-v2")

def get_embedding(text):
    return embedding_model.encode(f"passage: {text}")
