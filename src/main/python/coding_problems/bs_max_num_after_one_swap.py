class Solution:
    def solve_naive(self, n):
        """
        for every digit at index i, compare it with every other digit at index k to the right O(n^2)
          - whenever a digit on right is bigger
          - generate the num with those swapped indexes
          - keep rolling max num from each swap
        """
        if n < 10: return n

        digits = str(n)
        max_n = digits
        for i in range(len(digits)):
            for k in range(i + 1, len(digits)):
                if digits[k] < digits[i]:
                    continue
                d = digits[0:i] + digits[k] + digits[i+1:k] + digits[i] + digits[k+1:]
                max_n = max(max_n, d)
        return int(max_n)

    def solve(self, n):
        """
        Basically the same approach as the naive solution, but iterate k indexes from the end
            - the very first swap is our max num
        """
        digits = list(str(n))
        for i in range(len(digits)):
            max_k = i
            for k in range(len(digits)-1, i, -1):
                if digits[max_k] < digits[k]:
                    max_k = k
            if max_k != i:
                digits[i], digits[max_k] = digits[max_k], digits[i]
                return int("".join(digits))
        return n

        # slightly more optimize
        # digits = str(n)
        # for i in range(len(digits)):
        #     max_k = i
        #     for k in range(len(digits)-1, i, -1):
        #         if digits[max_k] < digits[k]:
        #             max_k = k
        #     if max_k != i:
        #         return int(digits[0:i] + digits[max_k] + digits[i+1:max_k] + digits[i] + digits[max_k+1:])
        # return n