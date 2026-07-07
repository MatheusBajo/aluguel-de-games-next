#!/usr/bin/env python3
# generate_tree.py

import os
import zipfile
import sys

def generate_tree(path, prefix=''):
    """
    Percorre recursivamente 'path' e imprime a estrutura em ASCII.
    """
    entries = sorted(os.listdir(path))
    pointers = ['├── '] * (len(entries) - 1) + ['└── '] if entries else []
    for pointer, name in zip(pointers, entries):
        full_path = os.path.join(path, name)
        print(prefix + pointer + name)
        if os.path.isdir(full_path):
            extension = '│   ' if pointer == '├── ' else '    '
            generate_tree(full_path, prefix + extension)

def main():
    root = 'Organizado'
    if not os.path.isdir(root):
        print(f"Erro: não encontrei a pasta '{root}' no diretório atual.")
        sys.exit(1)

    # Gerar o texto da árvore
    tree_file = 'Organizado_tree.txt'
    with open(tree_file, 'w', encoding='utf-8') as f:
        original_stdout = sys.stdout
        sys.stdout = f
        print(root)
        generate_tree(root)
        sys.stdout = original_stdout

    print(f"✔ Árvore salva em '{tree_file}'")

    # Compactar num ZIP
    zip_name = 'tree.zip'
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(tree_file)
    print(f"✔ Compactado em '{zip_name}'")

    print("\nPronto! Baixe o arquivo 'tree.zip' com a árvore da pasta Organizado.")

if __name__ == '__main__':
    main()
