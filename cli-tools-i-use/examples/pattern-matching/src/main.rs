fn main() {
    point2();
    if let Some(val) = returns_option(true) {
        println!("val = {val}");
    }
}

fn returns_option(v: bool) -> Option<&'static str> {
    if v {
        Some("hello")
    } else {
        None
    }
}

fn point() {
    struct Point {
        x: i32,
        y: i32,
    }

    let p = Some(Point { x: 1, y: 2 });
    match p {
        Some(Point { x, y }) => println!("{x}, {y}"),
        None => println!("There's no point"),
    }
}

fn point2() {
    struct Point {
        x: i32,
        y: i32,
    }

    let p = Some(Point { x: 1, y: 2 });
    match p {
        Some(Point { x, y }) if x >= 0 => println!("right: {x}, {y}"),
        Some(Point { x, y }) => println!("left: {x}, {y}"),
        None => println!("There's no point"),
    }
}
