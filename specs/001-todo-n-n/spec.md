# Feature Specification: シンプルなブラウザベースのTODOリスト

**Feature Branch**: `001-todo-n-n`  
**Created**: 2025-09-25  
**Status**: Draft  
**Input**: User description: "シンプルなブラウザベースのTODOリストアプリを開発します。\n\nユーザはこのTODOリストを使って、簡単なタスク管理ができるようになります。\n\n今回は次の最低限の機能だけを提供したいです。\n\n- タスクの追加\n- タスクの表示\n- タスクの完了\n\nタスクの表示は、タスクの一覧表示のみとします。\nまた、追加と完了も、この一覧表示状態のページから行えるようにします。\n\n完了したものは完了状態で一覧で見られます。\n\n表示順は作成日時昇順のみです。完了操作による並べ替えは発生しません。\n\n一覧表示で確認できるのは、タスクのタイトルと状態（未完了か完了か）だけです。\n\n次のような機能は応用的なので、今回は提供しません。\n\n- タスクの編集\n- タスクの並べ替え\n- タスクの削除(完了させずに削除したり、完了したものを削除したり)\n- ブラウザを閉じて、再度開くと、以前のタスクが見られる。\n\n利用環境としては、PCのChromeから利用できれば良いです。"

## Clarifications

### Session 2025-09-25
- Q: 無効な入力（空文字・空白のみ）のとき、「追加」操作の挙動はどれにしますか？ → A: B（入力が有効になるまでボタン無効化、エラー文言は表示しない）
- Q: 完了にしたタスクを未完了へ戻す操作は提供しますか？ → A: B（提供しない／完了は一方向）
- Q: Chromeの最低サポートバージョンはどれにしますか？ → A: B（現行安定版のみ）

## User Scenarios & Testing (mandatory)

### Primary User Story
PCのChromeでTODOリストページを開いた一般ユーザとして、タスクのタイトルを入力して追加し、一覧で未完了/完了の状態を確認しながら、必要に応じて各タスクを完了にできるようにしたい。

### Acceptance Scenarios
1. Given 空の一覧表示状態、When タイトル入力欄に文字列を入力して「追加」操作、Then 新しいタスクが未完了状態で一覧の末尾(作成日時昇順の最後)に表示される。
2. Given 複数の未完了タスクが作成日時昇順で表示、When あるタスクの「完了」操作、Then そのタスクは完了状態に変わり、表示位置は変わらない(作成日時昇順のまま)。
3. Given 未完了と完了が混在する一覧、When ページを表示、Then すべてのタスクがタイトルと状態(未完了/完了)のみ表示される。
4. Given 入力欄が空または空白のみ、When 入力が有効でない状態、Then 「追加」ボタンは無効化され押下できない。
5. Given タスクが完了状態、When 一覧画面を閲覧、Then 未完了へ戻す操作は表示されない/提供されない。

### Edge Cases
- タイトルが空白のみの場合の扱い。
- 極端に長いタイトルの場合の表示切れ/折返し。
- 同一タイトルのタスクを複数追加する場合の可否(今回は許可)。
- 連続で高速に追加/完了操作を行った際の重複操作防止(最低限の一貫性確保)。

## Requirements (mandatory)

### Functional Requirements
- FR-001: システムはユーザがタスクのタイトルを入力し追加できること。
- FR-002: システムはタスク一覧を作成日時の昇順で表示すること。追加されたタスクは一覧の末尾に表示されること。
- FR-003: システムは各タスクの状態(未完了/完了)を表示すること。
- FR-004: システムはユーザが一覧からタスクを完了に変更できること。
- FR-005: 完了に変更しても表示順は変わらないこと(作成日時昇順を維持)。
- FR-006: 一覧上で確認できる情報はタイトルと状態のみであること。
- FR-007: ページは単一画面で、追加操作と完了操作が同一画面(一覧)から行えること。
- FR-008: 空文字列または空白のみのタイトルは追加不可とし、入力が有効になるまで「追加」ボタンを無効化する(エラー文言は表示しない)。
- FR-009: 同一タイトルの複数追加は許可されること。
- FR-010: ブラウザを閉じた後のデータ保持は提供しないこと(セッションを跨いでの復元なし)。
- FR-011: タスクの編集、削除、並べ替えは今回のスコープに含めないこと。
- FR-012: 動作対象はPC版Chromeの現行安定版のみをサポートすること。
- FR-013: 完了状態から未完了へ戻す操作は提供しない(完了一方向)。

### Key Entities
- Task: ユーザが管理する単一のタスクを表す。
  - 属性: id(文字列), title(文字列), status(未完了|完了), createdAt(作成日時)

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed
