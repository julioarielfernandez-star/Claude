# Data Processing API

A comprehensive Python API for batch data processing with built-in caching, validation, and security features.

## Features

- **Batch Processing**: Process multiple data items efficiently with automatic error handling
- **Intelligent Caching**: Built-in TTL-based caching to avoid reprocessing identical items
- **Data Validation**: Configurable validation to ensure data integrity
- **Data Transformation**: Automatic data enrichment with metadata and checksums
- **Configuration Merging**: Deep merge utility for complex configuration management
- **Input Sanitization**: Security-focused input sanitization to prevent injection attacks

## Installation

```bash
# No external dependencies required - uses Python standard library only
python3 --version  # Requires Python 3.7+
```

## Quick Start

### Basic Data Processing

```python
from api import DataProcessor

# Initialize processor with 5-minute cache
processor = DataProcessor(cache_ttl=300)

# Prepare your data
items = [
    {"id": 1, "type": "user", "data": '{"name": "Alice", "age": 30}'},
    {"id": 2, "type": "user", "data": '{"name": "Bob", "age": 25}'},
    {"id": 3, "type": "admin", "data": '{"name": "Charlie", "role": "superadmin"}'}
]

# Process the batch
result = processor.process_batch(items, validate=True, transform=True)

print(f"Successfully processed: {result['success']}/{result['total']} items")
print(f"Errors encountered: {len(result['errors'])}")

# Access processed results
for item in result['results']:
    print(f"ID: {item['id']}, Processed at: {item['processed_at']}")
    print(f"Checksum: {item['checksum']}")
```

### Using the Cache

```python
# First processing - item will be processed and cached
processor.process_batch([item])

# Check if item is in cache
cached_result = processor.get_cached(item)
if cached_result:
    print("Found in cache!")
else:
    print("Cache miss")

# View cache statistics
stats = processor.get_cache_stats()
print(f"Cache has {stats['valid_entries']} valid entries")
print(f"Cache efficiency: {stats['valid_entries']}/{stats['total_entries']}")

# Clear cache when needed
processor.clear_cache()
```

### Configuration Merging

```python
from api import merge_configs

# Base configuration
base_config = {
    "database": {
        "host": "localhost",
        "port": 5432,
        "pool_size": 10
    },
    "logging": {
        "level": "INFO",
        "file": "app.log"
    },
    "debug": True
}

# Environment-specific overrides
prod_config = {
    "database": {
        "host": "prod.example.com",
        "pool_size": 50
    },
    "debug": False,
    "monitoring": {
        "enabled": True
    }
}

# Deep merge - nested dicts are merged recursively
final_config = merge_configs(base_config, prod_config, deep=True)

print(final_config)
# {
#     "database": {
#         "host": "prod.example.com",  # overridden
#         "port": 5432,                 # preserved from base
#         "pool_size": 50               # overridden
#     },
#     "logging": {
#         "level": "INFO",
#         "file": "app.log"
#     },
#     "debug": False,                   # overridden
#     "monitoring": {                   # new key added
#         "enabled": True
#     }
# }

# Shallow merge - nested dicts are replaced entirely
shallow_config = merge_configs(base_config, prod_config, deep=False)
# shallow_config["database"] will only have "host" and "pool_size"
```

### Input Sanitization

```python
from api import sanitize_input

# Sanitize potentially dangerous user input
user_input = "<script>alert('XSS')</script>"
safe_input = sanitize_input(user_input)
print(safe_input)  # Output: "scriptalert(XSS)script"

# Enforce type constraints
try:
    sanitize_input([1, 2, 3], allowed_types=[str, int])
except TypeError as e:
    print(f"Type validation failed: {e}")

# Limit string length
long_string = "A" * 1000
truncated = sanitize_input(long_string, max_length=100)
print(len(truncated))  # Output: 100

# Recursively sanitize nested structures
user_data = {
    "username": "<admin>",
    "comments": [
        "Nice product!",
        "<script>bad code</script>"
    ],
    "profile": {
        "bio": "Hello & welcome"
    }
}

sanitized = sanitize_input(user_data)
print(sanitized)
# {
#     "username": "admin",
#     "comments": ["Nice product!", "scriptbad codescript"],
#     "profile": {"bio": "Hello  welcome"}
# }
```

## Advanced Usage

### Custom Validation

The DataProcessor validates items for required fields: `id`, `type`, and `data`. You can bypass validation:

```python
# Skip validation for trusted data sources
result = processor.process_batch(items, validate=False, transform=True)
```

### Skip Transformation

Process items without adding metadata:

```python
# Process without transformation (no timestamp, checksum, or JSON parsing)
result = processor.process_batch(items, validate=True, transform=False)
```

### Error Handling

```python
items = [
    {"id": 1, "type": "user", "data": '{"name": "Alice"}'},
    {"id": 2},  # Missing required fields
    {"id": 3, "type": "user", "data": "invalid json{"}
]

result = processor.process_batch(items)

# Check for errors
if result['errors']:
    print(f"Encountered {len(result['errors'])} errors:")
    for error in result['errors']:
        print(f"  Item index {error['index']}: {error['error']}")
        print(f"  Problematic item: {error['item']}")
```

### Cache Management

```python
# Configure cache TTL (time-to-live)
short_cache = DataProcessor(cache_ttl=60)     # 1 minute
medium_cache = DataProcessor(cache_ttl=300)   # 5 minutes (default)
long_cache = DataProcessor(cache_ttl=3600)    # 1 hour

# Monitor cache performance
stats = processor.get_cache_stats()
if stats['expired_entries'] > 0:
    print(f"Warning: {stats['expired_entries']} expired entries in cache")
    processor.clear_cache()  # Clean up expired entries
```

## API Reference

### DataProcessor Class

#### `__init__(cache_ttl=300)`
Initialize the processor with optional cache TTL in seconds.

#### `process_batch(items, validate=True, transform=True)`
Process a batch of items with optional validation and transformation.

**Returns:** Dictionary with keys:
- `results`: List of successfully processed items
- `errors`: List of error details for failed items
- `total`: Total number of items
- `success`: Number of successfully processed items

#### `get_cached(item)`
Retrieve cached result for an item if available and not expired.

**Returns:** Cached item or `None`

#### `clear_cache()`
Clear all cached items and timestamps.

#### `get_cache_stats()`
Get statistics about cache state.

**Returns:** Dictionary with:
- `total_entries`: Total cached items
- `valid_entries`: Non-expired items
- `expired_entries`: Expired items
- `cache_ttl`: Current TTL setting

### Utility Functions

#### `merge_configs(base_config, override_config, deep=True)`
Merge two configuration dictionaries.

**Parameters:**
- `base_config`: Base configuration
- `override_config`: Override configuration
- `deep`: Enable recursive deep merging (default: True)

**Returns:** Merged configuration dictionary

#### `sanitize_input(data, allowed_types=None, max_length=None)`
Sanitize user input to prevent injection attacks.

**Parameters:**
- `data`: Input data to sanitize
- `allowed_types`: List of allowed types (optional)
- `max_length`: Maximum string length (optional)

**Returns:** Sanitized data

**Raises:** `TypeError` if data type not in allowed_types

## Security Considerations

The `sanitize_input` function removes dangerous characters but should be used as part of a defense-in-depth strategy:

- **XSS Prevention**: Removes `< > & " ' /` characters
- **Not a Complete Solution**: Use additional security measures like:
  - Parameterized database queries for SQL injection prevention
  - Content Security Policy headers
  - HTML entity encoding when rendering
  - Input validation at application boundaries

## Performance Tips

1. **Batch Size**: Process items in batches of 100-1000 for optimal performance
2. **Cache TTL**: Set based on data volatility (shorter for frequently changing data)
3. **Validation**: Disable for trusted data sources to improve throughput
4. **Transformation**: Skip if you don't need metadata enrichment

## Examples

See the docstrings in `api.py` for additional examples and detailed parameter descriptions.

## License

MIT License - Feel free to use in your projects

## Contributing

Contributions welcome! Please ensure all functions maintain comprehensive documentation.
