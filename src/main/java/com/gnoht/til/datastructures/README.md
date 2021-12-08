### Data Structures

A list of common data structures and their core operations and runtimes.  

  - [Heap](#heap)
  - [Linked List](#linked-list)
  - [Stack](#stack)

#### Heap 

Collection based data structure where 
A tree-based data structure that satisfies the following property: for any given node in the "tree" like structure, it's value must be:
  - less than it's parent value if implemented as a max heap
  - greater than it's parent value if implemented as a min heap

For example if an implementation is a max heap, it will always return the max value at the moment among all values in the heap. It's common to implement a heap as a binary heap via a binary tree (using a simple array).

Operations | Description | Runtime
--- | --- | ---
peek() | Return the max (for max heap) or min (for min heap) value within the heap | O(1)
pop() | Remove and return the max (for max heap) or min (for min heap) value within the heap | O(log(n))
push(item) | Add an item to the heap | O(log(n))

[Heap.java](/src/main/java/com/gnoht/til/datastructures/Heap.java) 


#### Linked List
A data structure representing a collection of nodes, where each node maintains a value in the collection and references to the other nodes. Order of the nodes are maintained by the references between the nodes. There are many types of Linked List by the most common are singly, doubly and circular.

#### Singly Linked List

In a singly linked list, nodes maintain a value a reference to the next node. The list itself maintains a reference to the head node.

```
HEAD --> (val1, next)--> (val2, next)--> ... (valn, next)--> NULL
```

Operations | Description | Runtime
--- | --- | ---
addFirst(item) | Add an item to the front of the list | O(1)
addLast(item) | Add an item to the end of the list | O(n)
removeFirst() | Remove and return the item from the front of the list | O(1)
removeLast() | Remove and return the item from the end of the list | O(n)

[SinglyLinkedList.java](/src/main/java/com/gnoht/til/datastructures/SinglyLinkedList.java)


#### Doubly Linked List

Linked list implementation that maintains a reference to both the head and tail of the list, and items
within the list have pointers to next and previous items. It has better performance for `addLast` and `removeLast` operations, but require extras space and complexity by maintaining an addition `previous`
pointer.

Operations | Description | Runtime
--- | --- | ---
addFirst(item) | Add an item to the front of the list | O(1)
addLast(item) | Add an item to the end of the list | O(1)
removeFirst() | Remove and return the item from the front of the list | O(1)
removeLast() | Remove and return the item from the end of the list | O(1)

[DoublyLinkedList.java](/src/main/java/com/gnoht/til/datastructures/DoublyLinkedList.java)


#### Stack

Data structure that consists of a collection of items stored in a FILO (e.g, like a stack of plates). Most stacks are backed by some type of a linked-list structure.

Operations | Description | Runtime
--- | --- | ---
peek() | Return the item at top of stack | O(1)
pop() | Remote and return item at top of stack | O(1)
push(item) | Push an item onto top of stack | O(1)

[Stack.java](/src/main/java/com/gnoht/til/datastructures/Stack.java)

