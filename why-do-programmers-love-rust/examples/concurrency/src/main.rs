use std::collections::HashMap;
use std::thread;

// fn main() {
//     let mut v: HashMap<&str, u64> = HashMap::new();
//     let mut handles = vec![];
//     for _ in 1..10 {
//         let h = thread::spawn(|| {
//             let entry = v.entry("key").or_insert(1);
//             *entry += 1;
//         });
//         handles.push(h);
//     }
//     for h in handles {
//         h.join().unwrap();
//     }
//     println!("v = {:?}", v);
// }

use std::sync::{Arc, Mutex};

fn main() {
    let v = Arc::new(Mutex::new(HashMap::new()));
    let mut handles = vec![];
    for _ in 1..10 {
        let v = Arc::clone(&v);
        let h = thread::spawn(move || {
            let mut v = v.lock().unwrap();
            let entry = v.entry("key").or_insert(1);
            *entry += 1;
        });
        handles.push(h);
    }
    for h in handles {
        h.join().unwrap();
    }
    println!("v = {:?}", v.lock().unwrap());
}
