//mod size;
mod traits;

//use size::*;
//use traits::*;

fn main() {
    // match_size(Size::Small);
    // match_size(Size::Medium);
    // match_size(Size::Large);
    traits::reverse();
}

use std::collections::HashMap;
fn foo() {
    let mut map1 = HashMap::new();
    map1.insert("hello", "world");

    #[derive(Eq, Hash, PartialEq)]
    struct MyStruct {
        name: String,
        length: u8,
    }

    let map2: HashMap<MyStruct, Vec<u64>> = HashMap::new();
}

fn bar() {
    #[derive(Default)]
    struct Collection<T> {
        items: Vec<T>,
        counter: u64,
    }
    let mut coll = Collection::default();
    coll.items.push(42);
    coll.counter += 1;
}

// fn baz() {
//     #[derive(Default)]
//     struct Collection<T: Copy> {
//         items: Vec<T>,
//         counter: u64,
//     }
//     let mut coll = Collection::default();
//     coll.items.push(String::from("hello"));
//     coll.counter += 1;
// }

// fn do_something() {
//     let next = next_value(42);
//     if next == 42 {
//         // ...
//     }
// }

fn do_something() {
    let next = next_value(42);
    match next {
        Some(n) => println!("Next == {}", n),
        None => println!("Found it!"),
    }
}

fn next_value(v: u64) -> Option<u64> {
    if v == 42 {
        return None;
    } else if v > 42 {
        return Some(v - 1);
    }
    Some(v + 1)
}

// use std::fs::File;
// fn open_file() {
//     let mut file = File::options().write(true).open("/path/to/file");
//     file.write("content".as_bytes());
// }

use std::{
    fs::File,
    io::{self, Write},
};
fn open_file() -> io::Result<()> {
    let mut file = File::options().write(true).open("/path/to/file")?;
    file.write("content".as_bytes())?;
    Ok(())
}

fn open_file2() -> io::Result<()> {
    let file = File::options().write(true).open("/path/to/file");
    let mut file = match file {
        Ok(f) => f,
        Err(e) => return Err(e),
    };
    match file.write("content".as_bytes()) {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}

struct Name {
    first: String,
    last: String,
}

enum Error {
    File(String),
    SizeExceeded(u64),
    BadName(Name),
}
