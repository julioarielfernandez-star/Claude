"""
Data Processing API Module

This module provides a comprehensive data processing API with caching capabilities,
input validation, transformation utilities, and configuration management.

The main components include:
    - DataProcessor: A class for batch processing data items with built-in caching
    - merge_configs: Utility function for merging configuration dictionaries
    - sanitize_input: Security utility for sanitizing user input

Example:
    Basic usage of the DataProcessor class:

    >>> processor = DataProcessor(cache_ttl=300)
    >>> items = [
    ...     {"id": 1, "type": "user", "data": '{"name": "Alice"}'},
    ...     {"id": 2, "type": "user", "data": '{"name": "Bob"}'}
    ... ]
    >>> result = processor.process_batch(items)
    >>> print(result['success'])
    2

Author: Claude API Documentation Team
Version: 1.0.0
"""

import json
import hashlib
import time
from typing import Dict, List, Any, Optional


class DataProcessor:
    """
    A batch data processor with caching, validation, and transformation capabilities.

    The DataProcessor class provides efficient batch processing of data items with
    built-in caching to avoid reprocessing identical items. It supports optional
    validation and transformation steps, along with comprehensive error handling.

    Attributes:
        cache (Dict[str, Any]): Internal cache storage for processed items.
        cache_ttl (int): Time-to-live for cached items in seconds.
        cache_timestamps (Dict[str, float]): Timestamps for cache entry creation.

    Example:
        >>> processor = DataProcessor(cache_ttl=600)
        >>> items = [{"id": 1, "type": "order", "data": {"amount": 100}}]
        >>> result = processor.process_batch(items)
        >>> print(f"Processed {result['success']} items")
        Processed 1 items
    """

    def __init__(self, cache_ttl: int = 300):
        """
        Initialize the DataProcessor with configurable cache settings.

        Args:
            cache_ttl (int, optional): Time-to-live for cached items in seconds.
                Defaults to 300 (5 minutes). After this time, cached items are
                considered expired and will be removed on next access.

        Example:
            >>> processor = DataProcessor(cache_ttl=600)  # 10 minute cache
            >>> processor.cache_ttl
            600
        """
        self.cache = {}
        self.cache_ttl = cache_ttl
        self.cache_timestamps = {}

    def process_batch(self, items: List[Dict], validate: bool = True,
                     transform: bool = True) -> Dict[str, Any]:
        """
        Process a batch of data items with optional validation and transformation.

        This method processes multiple items in a single call, applying validation
        and transformation steps as configured. Successfully processed items are
        automatically cached for future retrieval. Errors are captured per-item
        without stopping the batch processing.

        Args:
            items (List[Dict]): List of data items to process. Each item should be
                a dictionary containing the data to process.
            validate (bool, optional): Whether to validate items before processing.
                If True, items missing required fields will be rejected. Defaults to True.
            transform (bool, optional): Whether to transform items during processing.
                If True, items will be enriched with additional metadata. Defaults to True.

        Returns:
            Dict[str, Any]: Processing result containing:
                - results (List[Dict]): Successfully processed items
                - errors (List[Dict]): Failed items with error details
                - total (int): Total number of items in the batch
                - success (int): Number of successfully processed items

        Example:
            >>> processor = DataProcessor()
            >>> items = [
            ...     {"id": 1, "type": "user", "data": {"name": "Alice"}},
            ...     {"id": 2, "type": "admin", "data": {"name": "Bob"}}
            ... ]
            >>> result = processor.process_batch(items, validate=True, transform=True)
            >>> print(f"{result['success']}/{result['total']} items processed")
            2/2 items processed

            >>> # Example with validation failure
            >>> invalid_items = [{"id": 1}]  # Missing required fields
            >>> result = processor.process_batch(invalid_items, validate=True)
            >>> len(result['errors'])
            1
        """
        results = []
        errors = []

        for idx, item in enumerate(items):
            try:
                if validate and not self._validate_item(item):
                    errors.append({"index": idx, "error": "Validation failed", "item": item})
                    continue

                if transform:
                    processed = self._transform_item(item)
                else:
                    processed = item

                cache_key = self._generate_cache_key(item)
                self._cache_result(cache_key, processed)
                results.append(processed)

            except Exception as e:
                errors.append({"index": idx, "error": str(e), "item": item})

        return {"results": results, "errors": errors, "total": len(items), "success": len(results)}

    def _validate_item(self, item: Dict) -> bool:
        """
        Validate that an item contains all required fields.

        This is an internal validation method that checks for the presence of
        required fields in the data item.

        Args:
            item (Dict): The data item to validate.

        Returns:
            bool: True if all required fields are present, False otherwise.

        Note:
            Required fields are: 'id', 'type', and 'data'
        """
        required_fields = ["id", "type", "data"]
        return all(field in item for field in required_fields)

    def _transform_item(self, item: Dict) -> Dict:
        """
        Transform and enrich a data item with additional metadata.

        This internal method applies transformations to the input item including:
        - Parsing JSON strings in the 'data' field
        - Adding processing timestamp
        - Computing and adding data checksum

        Args:
            item (Dict): The original data item to transform.

        Returns:
            Dict: Transformed item with additional fields:
                - processed_at (float): Unix timestamp of processing
                - checksum (str): MD5 checksum of the data field
                - data: Parsed JSON object if originally a string

        Note:
            This method does not modify the original item; it returns a copy.
        """
        transformed = item.copy()
        if "data" in transformed and isinstance(transformed["data"], str):
            try:
                transformed["data"] = json.loads(transformed["data"])
            except json.JSONDecodeError:
                pass

        transformed["processed_at"] = time.time()
        transformed["checksum"] = self._calculate_checksum(item)
        return transformed

    def _generate_cache_key(self, item: Dict) -> str:
        """
        Generate a unique cache key for a data item.

        Creates a deterministic SHA-256 hash of the item's contents to use
        as a cache key. Identical items will always produce the same key.

        Args:
            item (Dict): The data item to generate a key for.

        Returns:
            str: A hexadecimal SHA-256 hash string (64 characters).

        Note:
            The JSON representation is sorted by keys to ensure consistency.
        """
        item_str = json.dumps(item, sort_keys=True)
        return hashlib.sha256(item_str.encode()).hexdigest()

    def _cache_result(self, key: str, value: Any) -> None:
        """
        Store a processed result in the cache with timestamp.

        This internal method stores both the processed value and the current
        timestamp for cache expiration management.

        Args:
            key (str): The cache key for storing the value.
            value (Any): The processed value to cache.
        """
        self.cache[key] = value
        self.cache_timestamps[key] = time.time()

    def get_cached(self, item: Dict) -> Optional[Dict]:
        """
        Retrieve a cached result for a given item if available and not expired.

        Checks the cache for a previously processed version of the item.
        Expired cache entries are automatically removed.

        Args:
            item (Dict): The data item to look up in the cache.

        Returns:
            Optional[Dict]: The cached processed item if found and not expired,
                None otherwise.

        Example:
            >>> processor = DataProcessor(cache_ttl=300)
            >>> item = {"id": 1, "type": "user", "data": {"name": "Alice"}}
            >>> processor.process_batch([item])
            >>> cached = processor.get_cached(item)
            >>> cached is not None
            True
            >>> # After cache_ttl seconds, returns None
        """
        cache_key = self._generate_cache_key(item)

        if cache_key in self.cache:
            timestamp = self.cache_timestamps.get(cache_key, 0)
            if time.time() - timestamp < self.cache_ttl:
                return self.cache[cache_key]
            else:
                del self.cache[cache_key]
                del self.cache_timestamps[cache_key]

        return None

    def _calculate_checksum(self, item: Dict) -> str:
        """
        Calculate an MD5 checksum for the data field of an item.

        Generates a checksum based on the JSON representation of the item's
        'data' field. Useful for data integrity verification.

        Args:
            item (Dict): The data item containing a 'data' field.

        Returns:
            str: A hexadecimal MD5 hash string (32 characters).

        Note:
            Only the 'data' field is used for checksum calculation.
            Keys are sorted for consistency.
        """
        data_str = json.dumps(item.get("data", {}), sort_keys=True)
        return hashlib.md5(data_str.encode()).hexdigest()

    def clear_cache(self) -> None:
        """
        Clear all cached items and timestamps.

        Removes all entries from the cache and resets the timestamp tracking.
        Useful for forcing reprocessing of all items or freeing memory.

        Example:
            >>> processor = DataProcessor()
            >>> # ... process items ...
            >>> processor.clear_cache()
            >>> stats = processor.get_cache_stats()
            >>> stats['total_entries']
            0
        """
        self.cache.clear()
        self.cache_timestamps.clear()

    def get_cache_stats(self) -> Dict[str, int]:
        """
        Get statistics about the current cache state.

        Provides information about cache usage including total entries,
        valid (non-expired) entries, and expired entries.

        Returns:
            Dict[str, int]: Cache statistics containing:
                - total_entries (int): Total number of cached items
                - valid_entries (int): Number of non-expired cached items
                - expired_entries (int): Number of expired but not yet removed items
                - cache_ttl (int): Current cache TTL setting in seconds

        Example:
            >>> processor = DataProcessor(cache_ttl=300)
            >>> # ... process some items ...
            >>> stats = processor.get_cache_stats()
            >>> print(f"Cache hit potential: {stats['valid_entries']} items")
            >>> print(f"Cache efficiency: {stats['valid_entries']/stats['total_entries']*100:.1f}%")
        """
        current_time = time.time()
        valid_entries = sum(
            1 for key in self.cache_timestamps
            if current_time - self.cache_timestamps[key] < self.cache_ttl
        )

        return {
            "total_entries": len(self.cache),
            "valid_entries": valid_entries,
            "expired_entries": len(self.cache) - valid_entries,
            "cache_ttl": self.cache_ttl
        }


def merge_configs(base_config: Dict, override_config: Dict, deep: bool = True) -> Dict:
    """
    Merge two configuration dictionaries with optional deep merging.

    This utility function combines two configuration dictionaries, with values
    from override_config taking precedence over base_config. Supports both
    shallow and deep merging strategies.

    Args:
        base_config (Dict): The base configuration dictionary.
        override_config (Dict): The override configuration dictionary.
            Values from this dict will override those in base_config.
        deep (bool, optional): If True, recursively merge nested dictionaries.
            If False, perform shallow merge (entire nested dicts are replaced).
            Defaults to True.

    Returns:
        Dict: A new dictionary containing the merged configuration.
            The original dictionaries are not modified.

    Example:
        >>> base = {"db": {"host": "localhost", "port": 5432}, "debug": True}
        >>> override = {"db": {"host": "prod.example.com"}, "timeout": 30}
        >>> result = merge_configs(base, override, deep=True)
        >>> result['db']
        {'host': 'prod.example.com', 'port': 5432}
        >>> result['timeout']
        30

        >>> # Shallow merge replaces entire nested dict
        >>> result_shallow = merge_configs(base, override, deep=False)
        >>> result_shallow['db']
        {'host': 'prod.example.com'}
        >>> 'port' in result_shallow['db']
        False

    Note:
        - Deep merging only applies to nested dictionaries
        - Lists and other types are always replaced, not merged
        - The function creates copies to avoid modifying the originals
    """
    if not deep:
        return {**base_config, **override_config}

    result = base_config.copy()

    for key, value in override_config.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_configs(result[key], value, deep=True)
        else:
            result[key] = value

    return result


def sanitize_input(data: Any, allowed_types: List[type] = None,
                   max_length: int = None) -> Any:
    """
    Sanitize user input by removing dangerous characters and enforcing constraints.

    This security utility function sanitizes user-provided data to prevent
    injection attacks and enforce data constraints. It handles strings, lists,
    and dictionaries recursively.

    Args:
        data (Any): The input data to sanitize. Can be a string, dict, list,
            or any other type.
        allowed_types (List[type], optional): List of allowed data types.
            If provided and data doesn't match any allowed type, raises TypeError.
            Defaults to None (all types allowed).
        max_length (int, optional): Maximum allowed length for strings.
            Strings longer than this will be truncated. Defaults to None (no limit).

    Returns:
        Any: The sanitized data. Type matches the input type.
            - Strings: Dangerous characters removed and length limited
            - Dicts: All values recursively sanitized
            - Lists: All items recursively sanitized
            - Other types: Returned unchanged after type validation

    Raises:
        TypeError: If allowed_types is specified and data type doesn't match
            any of the allowed types.

    Example:
        >>> # Sanitize a potentially dangerous string
        >>> sanitize_input("<script>alert('xss')</script>")
        'scriptalert(xss)script'

        >>> # Enforce type constraints
        >>> sanitize_input("hello", allowed_types=[str, int])
        'hello'
        >>> sanitize_input([], allowed_types=[str, int])
        Traceback (most recent call last):
            ...
        TypeError: Data type <class 'list'> not in allowed types: [<class 'str'>, <class 'int'>]

        >>> # Limit string length
        >>> sanitize_input("very long string here", max_length=10)
        'very long '

        >>> # Recursive sanitization of nested structures
        >>> data = {"user": "<script>", "items": ["<div>", "safe"]}
        >>> sanitize_input(data)
        {'user': 'script', 'items': ['div', 'safe']}

    Security Notes:
        - Removes the following dangerous characters: < > & " ' /
        - Does not perform URL encoding or HTML entity encoding
        - Should be used in combination with other security measures
        - Not suitable as sole defense against SQL injection (use parameterized queries)
    """
    if allowed_types and not any(isinstance(data, t) for t in allowed_types):
        raise TypeError(f"Data type {type(data)} not in allowed types: {allowed_types}")

    if isinstance(data, str):
        if max_length and len(data) > max_length:
            data = data[:max_length]

        dangerous_chars = ["<", ">", "&", "\"", "'", "/"]
        for char in dangerous_chars:
            data = data.replace(char, "")

    elif isinstance(data, dict):
        return {k: sanitize_input(v, allowed_types, max_length) for k, v in data.items()}

    elif isinstance(data, list):
        return [sanitize_input(item, allowed_types, max_length) for item in data]

    return data
