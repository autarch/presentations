use std::fmt;

#[derive(Debug, PartialEq)]
pub enum Size {
    Small,
    Medium,
    Large,
}

pub fn match_size(size: Size) {
    match size {
        Size::Small => println!("It's small: {}", size),
        Size::Medium => println!("It's medium: {}", size),
        Size::Large => println!("It's large: {}", size),
    }
}

impl fmt::Display for Size {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "size = {:?}", self)
    }
}
