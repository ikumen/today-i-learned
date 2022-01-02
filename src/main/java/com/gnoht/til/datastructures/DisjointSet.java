package com.gnoht.til.datastructures;

/**
 * @author ikumen@gnoht.com
 */
public class DisjointSet<T> {
  private final T value;
  private int size;
  private DisjointSet<T> parent;

  public DisjointSet(T value) {
    this.value = value;
    this.size = 1;
    this.parent = this;
  }

  /**
   * Return the parent of the given set.
   * @param ds
   * @return
   */
  public DisjointSet<T> find(DisjointSet<T> ds) {
    if (ds.parent != ds)
      ds.parent = find(ds.parent);
    return ds.parent;
  }

  /**
   * Join the other set with this set if not already in same set.
   * @param other {@link DisjointSet} set to join with this set.
   * @return the enclosing set
   */
  public DisjointSet<T> union(DisjointSet<T> other) {
    final DisjointSet<T> ourParent = find(this);
    final DisjointSet<T> otherParent = find(other);
    // if not in same set
    if (ourParent != otherParent) {
      if (ourParent.size > otherParent.size) {
        otherParent.parent = ourParent;
        ourParent.size += otherParent.size;
      } else {
        ourParent.parent = otherParent;
        otherParent.size += ourParent.size;
        return otherParent;
      }
    }
    return ourParent;
  }
}
