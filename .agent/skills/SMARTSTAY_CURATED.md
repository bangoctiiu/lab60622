# SmartStay — Danh sách Skill Curated

> **Chỉ dùng các skill dưới đây.** Không load toàn bộ catalog. Trỏ thông minh theo loại task.
> 
> _Lưu ý: Một số skill trong catalog có thể thiếu (symlink Windows). Chỉ liệt kê skill đã verify tồn tại._

## Danh sách Skill (10 skills — đã verify)

| # | Skill ID | Khi nào dùng |
|---|----------|--------------|
| 1 | `react-best-practices` | Component React, data fetching, performance, re-render |
| 2 | `react-patterns` | Hooks, state, composition, patterns React hiện đại |
| 3 | `react-ui-patterns` | Loading, error, empty states, data display (thay angular-ui-patterns) |
| 4 | `tailwind-patterns` | Tailwind CSS, styling, responsive |
| 5 | `tailwind-design-system` | Design tokens, theme, components Tailwind |
| 6 | `web-design-guidelines` | UI guidelines, aesthetics (thay frontend-design) |
| 7 | `typescript-expert` | TypeScript, types, strict mode |
| 8 | `web-performance-optimization` | Tối ưu performance frontend |
| 9 | `web-security-testing` | XSS, client-side security, secure frontend |
| 10 | `planning-with-files` | Lập kế hoạch trước khi code (thay concise-planning) |

## Đường dẫn Skill

Tất cả skill nằm tại: `.agent/skills/skills/<skill-id>/SKILL.md`

Ví dụ:
- `.agent/skills/skills/react-best-practices/SKILL.md`
- `.agent/skills/skills/tailwind-patterns/SKILL.md`

## Skill Map — Trỏ thông minh theo task

```
TASK                           → SKILL(S) ƯU TIÊN
─────────────────────────────────────────────────────────────────
Component mới / Page mới       → react-patterns, web-design-guidelines
Form (Contract, Invoice, …)    → react-patterns, react-ui-patterns
DataTable / List               → react-patterns, react-ui-patterns
Styling / Layout               → tailwind-patterns, tailwind-design-system
Performance / Re-render        → react-best-practices, web-performance-optimization
TypeScript / Types             → typescript-expert
Validation / XSS / Security    → web-security-testing
Design System tokens           → tailwind-design-system + rule.md (bắt buộc)
Lập kế hoạch task              → planning-with-files
```

## Workflow

1. Nhận task → Xác định loại (form/table/api/styling/…)
2. Tra Skill Map → Chọn 1–2 skill phù hợp
3. Đọc `SKILL.md` từ `.agent/skills/skills/<id>/`
4. Áp dụng + Design System từ `rule.md` → Generate
