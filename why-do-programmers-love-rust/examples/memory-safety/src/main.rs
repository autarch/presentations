// fn main() {
//     returns_pointer();
// }

// fn returns_pointer() -> &u64 {
//     let val = 42;
//     return &val;
// }

fn main() {
    let mut vec = vec![1, 2, 3];
    for v in &vec {
        vec.push(v * 2);
    }
}
