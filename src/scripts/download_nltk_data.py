import nltk

# Specify the directory where you want to download the data
nltk_data_dir = 'src/nltk_data'
nltk.data.path.append(nltk_data_dir)

# Download the 'words' corpus
nltk.download('words', download_dir=nltk_data_dir)

# Download the 'wordnet' corpus
nltk.download('wordnet', download_dir=nltk_data_dir)

# Optional: You can also download other corpora or packages if needed
# For example, downloading 'punkt' for tokenization
nltk.download('punkt', download_dir=nltk_data_dir)