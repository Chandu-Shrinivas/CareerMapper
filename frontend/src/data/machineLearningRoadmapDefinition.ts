import type { RoadmapDefinition } from '../types/roadmap';

export const MACHINE_LEARNING_ROADMAP_DEFINITION: RoadmapDefinition = {
  id: 'machine-learning',
  slug: 'machine-learning',
  title: 'Machine Learning Roadmap',
  version: '2026.1',
  description: 'Step by step guide to becoming a Machine Learning Engineer in 2026',
  nodes: [
    {
      id: 'ml-main-header',
      title: 'Machine Learning',
      type: 'main',
      description: 'Step by step guide to becoming a Machine Learning Engineer in 2026.',
      statusEnabled: false
    },
    {
      id: 'ml-topic-intro',
      title: 'Introduction',
      type: 'topic',
      description: 'Understanding the role of a Machine Learning Engineer, responsibilities, and how ML differs from traditional software engineering and AI engineering.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'critical'
    },
    {
      id: 'ml-subtopic-what-is-ml-engineer',
      title: 'What is an ML Engineer?',
      type: 'subtopic',
      description: 'An ML Engineer designs, builds, and deploys machine learning models and infrastructure to solve complex data-driven problems.',
      parentId: 'ml-topic-intro',
      parentTitle: 'Introduction',
      statusEnabled: true
    },
    {
      id: 'ml-subtopic-ml-vs-ai-engineer',
      title: 'ML Engineer vs AI Engineer',
      type: 'subtopic',
      description: 'Comparing core ML model development and statistical modeling with application-level AI systems, LLM integrations, and agent orchestration.',
      parentId: 'ml-topic-intro',
      parentTitle: 'Introduction',
      statusEnabled: true
    },
    {
      id: 'ml-subtopic-skills-responsibilities',
      title: 'Skills and Responsibilities',
      type: 'subtopic',
      description: 'Key skills including mathematics, programming, data modeling, algorithm implementation, model training, evaluation, and deployment.',
      parentId: 'ml-topic-intro',
      parentTitle: 'Introduction',
      statusEnabled: true
    },
    {
      id: 'ml-topic-linear-algebra',
      title: 'Linear Algebra',
      type: 'topic',
      description: 'Vector spaces, matrix operations, singular value decomposition, eigenvalues, and eigenvectors essential for ML transformations.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'high'
    },
    {
      id: 'ml-topic-calculus',
      title: 'Calculus',
      type: 'topic',
      description: 'Derivatives, partial derivatives, gradients, Jacobians, and Hessians required for optimization algorithms like gradient descent.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'high'
    },
    {
      id: 'ml-topic-statistics',
      title: 'Statistics',
      type: 'topic',
      description: 'Descriptive and inferential statistics, hypothesis testing, data distributions, and graphical data analysis.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'high'
    },
    {
      id: 'ml-topic-probability',
      title: 'Probability',
      type: 'topic',
      description: 'Probability theory, Bayes theorem, random variables, PDFs, and probability distributions used in ML modeling.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'high'
    },
    {
      id: 'ml-topic-discrete-math',
      title: 'Discrete Mathematics',
      type: 'topic',
      description: 'Logic, set theory, graph theory, and combinatorics underpinning machine learning data structures.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'medium'
    },
    {
      id: 'ml-topic-python',
      title: 'Python',
      type: 'topic',
      description: 'The primary programming language for ML development, data analysis, and deep learning framework integration.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'critical'
    },
    {
      id: 'ml-topic-basic-syntax',
      title: 'Basic Syntax',
      type: 'topic',
      description: 'Variables, data types, loops, conditionals, functions, and error handling in Python.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-[#1]',
      title: 'Object Oriented Programming',
      type: 'topic',
      description: 'Classes, inheritance, encapsulation, and modular design principles in Python.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-essential-libraries',
      title: 'Essential libraries',
      type: 'topic',
      description: 'Core numerical computing, data analysis, and visualization libraries in Python: NumPy, Pandas, Matplotlib, Seaborn.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'critical'
    },
    {
      id: 'ml-topic-data-sources',
      title: 'Data Sources',
      type: 'topic',
      description: 'Collecting data from relational/NoSQL databases, web APIs, internet scraping, mobile apps, and IoT devices.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-data-formats',
      title: 'Data Formats',
      type: 'topic',
      description: 'Handling JSON, Parquet, CSV, Excel, and serialized data formats efficiently in data pipelines.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-preprocessing',
      title: 'Preprocessing Techniques',
      type: 'topic',
      description: 'Data cleaning, feature scaling, normalization, feature selection, and dimensionality reduction.',
      statusEnabled: true,
      difficulty: 'intermediate',
      priority: 'high'
    },
    {
      id: 'ml-topic-what-is-ml',
      title: 'What is Machine Learning?',
      type: 'topic',
      description: 'Core concepts of training models from data to generalize and make predictions without explicit programming.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'critical'
    },
    {
      id: 'ml-topic-types-of-ml',
      title: 'Types of Machine Learning',
      type: 'topic',
      description: 'Supervised, Unsupervised, Semi-supervised, Self-supervised, and Reinforcement Learning paradigms.',
      statusEnabled: true,
      difficulty: 'beginner',
      priority: 'critical'
    },
    {
      id: 'ml-topic-scikit-learn',
      title: 'Scikit-learn',
      type: 'topic',
      description: 'The standard Python library for classical machine learning algorithms, preprocessing, and model evaluation.',
      statusEnabled: true,
      difficulty: 'intermediate',
      priority: 'critical'
    },
    {
      id: 'ml-topic-what-is-supervised',
      title: 'What is Supervised Learning?',
      type: 'topic',
      description: 'Learning algorithms trained on labeled datasets to learn mappings from inputs to targets.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-classification',
      title: 'Classification',
      type: 'topic',
      description: 'Predicting discrete class labels using KNN, Logistic Regression, SVMs, Decision Trees, Random Forests, and Gradient Boosting.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-regression',
      title: 'Regression',
      type: 'topic',
      description: 'Predicting continuous quantities using Linear, Polynomial, Lasso, Ridge, and ElasticNet models.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-what-is-unsupervised',
      title: 'What is Unsupervised Learning?',
      type: 'topic',
      description: 'Discovering hidden patterns and structures in unlabeled datasets.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-clustering',
      title: 'Clustering',
      type: 'topic',
      description: 'Grouping unlabelled data using K-Means, Hierarchical, DBSCAN, Overlapping, and Probabilistic models.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-dim-reduction',
      title: 'Dimensionality Reduction',
      type: 'topic',
      description: 'Reducing feature space using PCA, t-SNE, UMAP, and Autoencoders.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-what-is-rl',
      title: 'What is Reinforcement Learning?',
      type: 'topic',
      description: 'Learning optimal policies through environment interaction, rewards, and feedback loops.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-model-eval',
      title: 'What is Model Evaluation?',
      type: 'topic',
      description: 'Assessing model performance, generalization ability, and bias-variance tradeoff.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-why-important',
      title: 'Why is it important?',
      type: 'topic',
      description: 'Preventing overfitting/underfitting, ensuring safety, reliability, and business metric alignment.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-metrics',
      title: 'Metrics to Evaluate',
      type: 'topic',
      description: 'Accuracy, Precision, Recall, F1-Score, ROC-AUC, Log Loss, and Confusion Matrix analysis.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-validation',
      title: 'Validation Techniques',
      type: 'topic',
      description: 'K-Fold Cross Validation, Stratified K-Fold, and Leave-One-Out (LOOCV) cross-validation.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-nn-basics',
      title: 'Neural Network (NN) Basics',
      type: 'topic',
      description: 'Perceptrons, Multi-layer Perceptrons, Forward Propagation, Backpropagation, Activation Functions, and Loss Functions.',
      statusEnabled: true,
      difficulty: 'intermediate',
      priority: 'critical'
    },
    {
      id: 'ml-topic-dl-libraries',
      title: 'Deep Learning Libraries',
      type: 'topic',
      description: 'Frameworks for building deep learning models: PyTorch, TensorFlow, Keras, and Scikit-learn.',
      statusEnabled: true,
      difficulty: 'intermediate',
      priority: 'high'
    },
    {
      id: 'ml-topic-dl-architectures',
      title: 'Deep Learning Architectures',
      type: 'topic',
      description: 'Advanced neural network structures tailored for computer vision, sequential data, and generative modeling.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-cnn',
      title: 'Convolutional Neural Network',
      type: 'topic',
      description: 'Convolutions, pooling layers, padding, and strides for image grid processing.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-cnn-apps',
      title: 'Applications of CNNs',
      type: 'topic',
      description: 'Image classification, object detection, image segmentation, video recognition, and recommendation systems.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-rnn',
      title: 'Recurrent Neural Networks',
      type: 'topic',
      description: 'Processing sequential data with vanilla RNNs, Gated Recurrent Units (GRU), and Long Short-Term Memory (LSTM).',
      statusEnabled: true
    },
    {
      id: 'ml-topic-attention',
      title: 'Attention Mechanisms',
      type: 'topic',
      description: 'Self-Attention, Multi-head Attention, and Transformer architectures revolutionizing NLP and Vision.',
      statusEnabled: true,
      difficulty: 'advanced',
      priority: 'critical'
    },
    {
      id: 'ml-topic-autoencoders',
      title: 'Autoencoders',
      type: 'topic',
      description: 'Encoder-decoder models for unsupervised representation learning, compression, and generative modeling.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-gan',
      title: 'Generative Adversarial Networks',
      type: 'topic',
      description: 'Generator and Discriminator adversarial training for synthetic data and image generation.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-explainable-ai',
      title: 'Explainable AI',
      type: 'topic',
      description: 'SHAP, LIME, and model interpretability techniques to audit black-box machine learning models.',
      statusEnabled: true
    },
    {
      id: 'ml-topic-nlp',
      title: 'Natural Language Processing',
      type: 'topic',
      description: 'Tokenization, lemmatization, stemming, word embeddings, and sequence modeling for text processing.',
      statusEnabled: true,
      difficulty: 'intermediate',
      priority: 'high'
    }
  ],
  relatedRoadmaps: [
    { id: 'ai-data-scientist', title: 'AI & Data Scientist', slug: 'ai-data-scientist' },
    { id: 'mlops', title: 'MLOps', slug: 'mlops' },
    { id: 'ai-engineer', title: 'AI Engineer', slug: 'ai-engineer' },
    { id: 'ai-agents', title: 'AI Agents', slug: 'ai-agents' }
  ]
};
