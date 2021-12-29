"""
Is Unique: Implement an algorithm to determine if a string has all unique 
characters. What if you cannot use additional data structures?
Hints: #44, #7 7 7, #732
"""
def is_unique(s):
    chars = list(s)
    chars.sort()
    prev = None
    for c in chars:
        if c == prev:
            return False
        prev = c
    return True

assert not is_unique('foobar') 
assert not is_unique('aaaa')
assert not is_unique('aabbdd')
assert is_unique('abcdfeghij')