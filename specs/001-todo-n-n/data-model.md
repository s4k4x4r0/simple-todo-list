# Data Model

## Entities

### Task

- id: string (内部識別子)
- title: string (非空、空白のみ不可)
- status: enum("未完了", "完了")
- createdAt: datetime (作成時刻、表示順用)

## Rules

- 追加時: `title` が有効でない場合は追加不可(ボタン無効)
- 完了は一方向(未完了→完了)。戻し不可
- 表示順は `createdAt` 昇順。完了操作で順序は変化しない

## Relationships

- なし(単一エンティティ)

## Persistence

- なし(メモリ内のみ、リロードで消失)
