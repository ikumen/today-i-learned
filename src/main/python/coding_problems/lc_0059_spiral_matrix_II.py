def generateMatrixSpiralTraversal(self, n: int):
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        
        matrix = [[None] * n for _ in range(n)]        
        mlen = n**2
        i = d = r = c = 0
        rinc, cinc = directions[d % 4]
        while i < mlen:
            while True:
                i += 1
                matrix[r][c] = i
                r += rinc
                c += cinc
                if r < 0 or r >= n or c < 0 or c >= n \
                        or matrix[r][c] is not None:
                    r -= rinc
                    c -= cinc
                    break
            d += 1
            rinc, cinc = directions[d % 4]
            r += rinc
            c += cinc
        
        return matrix