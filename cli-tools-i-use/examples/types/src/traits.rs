trait Reverse {
    fn reverse(&self) -> Self;
}

impl<T: Copy> Reverse for Vec<T> {
    fn reverse(&self) -> Self {
        let mut rev = Vec::with_capacity(self.len());
        for i in (0..self.len()).rev() {
            rev.push(self[i]);
        }
        rev
    }
}

pub fn reverse() {
    let v = vec![1, 2, 3];
    println!("Reverse of {:?} = {:?}", v, v.reverse());
}
