//! Sample Rust module demonstrating Carbonline syntax highlighting.

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Status {
    Active,
    Idle(u64),
    Failed(String),
}

pub trait Dispatcher {
    fn dispatch(&self, event_id: &str) -> Result<Status, std::io::Error>;
}

pub struct TaskQueue<T: Clone> {
    workers: usize,
    registry: Arc<Mutex<HashMap<String, T>>>,
}

impl<T: Clone> TaskQueue<T> {
    pub const MAX_RETRIES: u32 = 5;

    pub fn new(workers: usize) -> Self {
        Self {
            workers,
            registry: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn register(&mut self, key: &str, item: T) -> bool {
        let mut guard = match self.registry.lock() {
            Ok(g) => g,
            Err(poisoned) => poisoned.into_inner(),
        };

        println!("Registering item under key '{}' with {} workers", key, self.workers);
        guard.insert(key.to_string(), item).is_none()
    }
}

