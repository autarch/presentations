fn main() {
    let vec = vec!["Dave", "Lisa", "Di Xin", "Laurent"];
    let lcd = vec
        .iter()
        .filter(|v| v.starts_with('D'))
        .map(|v| v.to_lowercase())
        .collect::<Vec<_>>();
    println!("lcd = {lcd:?}");
    seq();
}

fn seq() {
    let s = Sequence { cur: 9 };
    for i in s {
        println!("{i}");
    }
}

struct Sequence {
    cur: u64,
}

impl Iterator for Sequence {
    type Item = u64;
    fn next(&mut self) -> Option<Self::Item> {
        let cur = self.cur;
        if cur > u64::MAX / 2 {
            None
        } else {
            self.cur = cur * 2;
            Some(cur)
        }
    }
}
