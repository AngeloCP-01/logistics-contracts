# logistics-contracts (Python)

Python distribution of the AI Logistics Platform contracts. v0.1.0 ships JSON Schemas only; Pydantic models will be added when the AI service is built.

## Install

From a wheel built in CI and uploaded to GitHub Packages:

```bash
pip install logistics-contracts --index-url <github-packages-url>
```

## Use

```python
from logistics_contracts import CONTRACTS_VERSION
print(CONTRACTS_VERSION)
```
