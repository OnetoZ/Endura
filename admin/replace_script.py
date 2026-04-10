import os

def walk(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        for name in files:
            if name.endswith('.jsx') or name.endswith('.js'):
                yield os.path.join(root, name)

def fix_all(dir_path):
    for file_path in walk(dir_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if ('productService' in content or 'products' in content or 'Product' in content or 'product' in content):
                # Don't touch productService import if it's already assetService somehow. Just replace:
                content = content.replace('productService', 'assetService')
                # Wait, this might break order.product or cart.product so I must be careful.
                # Actually user wants to rename "fetch assets data in admin and frontnd in products and collection page remove products scema and change it to assets rewrite proper code that can uploas and fetch all the data from backend"
                # Let's replace:
                content = content.replace('getProducts', 'getAssets')
                content = content.replace('getProductById', 'getAssetById')
                content = content.replace('createProduct', 'createAsset')
                content = content.replace('updateProduct', 'updateAsset')
                content = content.replace('deleteProduct', 'deleteAsset')
                content = content.replace('setProducts', 'setAssets')
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
        except Exception as e:
            print(f"Failed {file_path}: {e}")

fix_all('./src')
