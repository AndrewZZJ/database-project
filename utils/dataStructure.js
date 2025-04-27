const util = require('util');

class Heap extends Array {
    constructor(A=[], reverse = false){
        super(...A);
        this.reverse = reverse;
        Heap.heapify(this);        
    }
    [util.inspect.custom]() {
        let prefix = this.reverse?"Max":"Min";
        return `${prefix}Heap(${JSON.stringify(this)})`;
    }
    
    swim(i, reverse = false){
        while(i > 0){
            let parent = Math.floor((i - 1) / 2);
            if(reverse ? this[parent] < this[i]: this[parent] > this[i]){ // Handle min or max heap
                [this[parent], this[i]] = [this[i], this[parent]]; // Swap elements
                i = parent;
            } else {
                break;
            }
        }
    }
    static sink(heap, i, reverse = false){
        while(i * 2 + 1 < heap.length){
            let left = i * 2 + 1;
            let right = i * 2 + 2;
            // Handle min or max heap
            // let child = right < heap.length && heap[right] < heap[left] ? right : left;
            let child = right < heap.length && (reverse?heap[right] > heap[left]:heap[right] < heap[left]) ? right : left; 
            if(reverse ? heap[child] > heap[i]: heap[child] < heap[i]){ // Handle min or max heap
                [heap[i], heap[child]] = [heap[child], heap[i]]; // Swap elements
                i = child;
            } else {
                break;
            }
        }
    }
    sink(i){
        Heap.sink(this, i, this.reverse);
    }
    
    static heapify(A, reverse = false){
        for(let i = Math.floor(A.length / 2)-1; i >= 0; i--){
            Heap.sink(A, i, reverse);
        }
    }
    static heappop(heap, reverse = false){
        [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]]; // Swap elements
        let result = heap.pop();
        heap.sink(heap, 0, reverse);
        return result;
    }
    static heappush(heap, value, reverse = false){
        heap.push(value);
        heap.swim(heap, heap.length - 1, reverse);
    }
    heappush(value){
        Heap.heappush(this, value);
    }
    heappop(){
        return Heap.heappop(this, this.reverse);
    }
}


class PriorityQueue {
    constructor(key = (x => x)) {
        this.key = key;
        this.heap = new Heap([]);
    }    
    push(value) {
        this.heap.heappush([this.key(value), value]);
    }    
    pop() {
        return this.heap.heappop()[1];
    }
}


module.exports = {Heap, PriorityQueue};