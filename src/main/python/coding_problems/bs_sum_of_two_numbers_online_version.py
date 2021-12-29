"""
Implement a data structure with the following methods:

    add(int val) adds the value val to the data structure
    find(int val) returns whether there are two elements whose sum equals to val

Constraints

    n ≤ 10,000 where n is the number of times add will be called
    m ≤ 1,000 where m is the number of times find will be called



https://binarysearch.com/problems/Sum-of-Two-Numbers-Online-Version
"""
class TwoSum:
    def __init__(self):
        self.vals = {}        

    def add(self, val):
        self.vals[val] = self.vals.get(val, 0) + 1

    def find(self, val):
        for k, v in self.vals.items():
            other = val - k
            if other in self.vals:
                if other == k and v == 1:
                    continue
                return True
        return False
        