# Instead of complex version detection, use a simple approach:
from setuptools import setup, find_packages

setup(
    name="ecommerce",
    version="0.1.0",  # Set version directly
    packages=find_packages(),
    # ... other setup arguments
)