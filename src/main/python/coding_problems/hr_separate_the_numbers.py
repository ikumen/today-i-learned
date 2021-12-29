"""
https://www.hackerrank.com/challenges/separate-the-numbers/problem
"""
#!/bin/python3

import math
import os
import random
import re
import sys

#
# Complete the 'separateNumbers' function below.
#
# The function accepts STRING s as parameter.
#

def separateNumbers(s):
    # Write your code here
    slen = len(s)    
    def sequence(n, d):
        # print(f"==> {n}")
        if n == s:
            return True
        if len(n) < slen and s.startswith(n):
            d += 1
            return sequence(f"{n}{d}", d)
        return False
                
    for i in range(slen//2):
        d = int(s[:i+1])
        if sequence(f"{d}", d):
            print(f"YES {d}")
            return
    print("NO")
        

if __name__ == '__main__':
    q = int(input().strip())

    for q_itr in range(q):
        s = input()

        separateNumbers(s)
