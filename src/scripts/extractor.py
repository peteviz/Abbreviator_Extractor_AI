import os
# from dotenv import load_dotenv
import json
import re
import sys
from docx import Document
from openai import OpenAI

# load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("No OpenAI API key found in environment variables.")

client = OpenAI(api_key=api_key)


def is_abbreviation(word):
    return re.fullmatch(r'([A-Z]+\.)+|[A-Z]+', word) is not None

def get_abbreviations_from_docx(file_path):
    doc = Document(file_path)
    abbreviations = set()
    
    for para in doc.paragraphs:
        words = para.text.split()
        for word in words:
            cleaned_word = re.sub(r'[^\w.]', '', word)
            if is_abbreviation(cleaned_word):
                abbreviations.add(cleaned_word)
    
    return abbreviations

def get_abbreviation_meanings(abbreviations, context):
    meanings = {}
    batch_size = 5
    
    abbreviation_list = list(abbreviations)
    for i in range(0, len(abbreviation_list), batch_size):
        batch = abbreviation_list[i:i+batch_size]
        prompt = "Provide the full form of the following abbreviations:\n\n"
        prompt += "\n".join(f"{abbr}: " for abbr in batch)
        prompt += f"\n\nContext: {context}"

        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "user", 
                 "content": prompt}
            ],
            temperature=0.0,
            max_tokens=200
        )

        if response.choices:
            response_text = response.choices[0].message.content.strip()
            for line in response_text.split('\n'):
                if ": " in line:
                    abbr, meaning = line.split(": ", 1)
                    meanings[abbr] = meaning

    return meanings

def extract_context_from_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

def main(file_path):
    try:
        abbreviations = get_abbreviations_from_docx(file_path)
        context = extract_context_from_docx(file_path)
        meanings = get_abbreviation_meanings(abbreviations, context)
        return meanings
    except Exception as e:
        print(f"Error during processing: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python extractor.py <file_path>', file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    meanings = main(file_path)
    print(json.dumps(meanings))
