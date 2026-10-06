// localStorage に保存するときの名前
const STORAGE_KEY = "todos";

// HTMLの要素を取得
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("todo-count");
const clearDoneButton = document.getElementById("clear-done");

// Todoの一覧データ。1件は { id, text, done } の形
let todos = loadTodos();

// ブラウザに保存されたTodoを読み込む（なければ空の配列）
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// 現在のTodoをブラウザに保存する
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // 保存できない環境（プライベートモードなど）では何もしない
  }
}

// todos の内容をもとに画面を作り直す
function render() {
  list.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Todoはありません";
    list.appendChild(empty);
  }

  for (const todo of todos) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    // 完了チェックボックス
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    // Todoの文字（textContent を使うと、入力された文字がそのまま表示され安全）
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = todo.text;

    // 削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.type = "button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, text, deleteButton);
    list.appendChild(li);
  }

  const remaining = todos.filter((todo) => !todo.done).length;
  count.textContent = `残り ${remaining} 件`;
}

// Todoを追加する
function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  render();
}

// 完了／未完了を切り替える
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  saveTodos();
  render();
}

// Todoを1件削除する
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

// フォーム送信（追加ボタン or Enterキー）
form.addEventListener("submit", (event) => {
  event.preventDefault(); // ページの再読み込みを止める
  const text = input.value.trim();
  if (text === "") return;
  addTodo(text);
  input.value = "";
  input.focus();
});

// 完了済みをまとめて削除
clearDoneButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.done);
  saveTodos();
  render();
});

// 最初に1回画面を描く
render();
