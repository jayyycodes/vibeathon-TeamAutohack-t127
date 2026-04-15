from fastapi import APIRouter

router = APIRouter()

MODULES = [
    {
        "id": 1,
        "title": "ML Basics",
        "description": "Core concepts of machine learning: types, workflows, and evaluation metrics.",
        "difficulty": "easy",
        "estimated_time": "2 hours",
    },
    {
        "id": 2,
        "title": "Supervised Learning",
        "description": "Regression, classification, decision trees, and model selection.",
        "difficulty": "easy",
        "estimated_time": "3 hours",
    },
    {
        "id": 3,
        "title": "Unsupervised Learning",
        "description": "Clustering, dimensionality reduction, and anomaly detection.",
        "difficulty": "medium",
        "estimated_time": "3 hours",
    },
    {
        "id": 4,
        "title": "Neural Networks",
        "description": "Perceptrons, backpropagation, activation functions, and architectures.",
        "difficulty": "medium",
        "estimated_time": "4 hours",
    },
    {
        "id": 5,
        "title": "Deep Learning",
        "description": "CNNs, RNNs, transformers, and training deep networks at scale.",
        "difficulty": "hard",
        "estimated_time": "5 hours",
    },
    {
        "id": 6,
        "title": "NLP",
        "description": "Text processing, embeddings, sequence models, and language understanding.",
        "difficulty": "hard",
        "estimated_time": "4 hours",
    },
    {
        "id": 7,
        "title": "Computer Vision",
        "description": "Image classification, object detection, segmentation, and GANs.",
        "difficulty": "hard",
        "estimated_time": "4 hours",
    },
]


@router.get("/modules")
def get_modules():
    return {"modules": MODULES}
