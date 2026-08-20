# Frontend Project Overview

# Sabse pehle project ko 1 minute me samjho

```text
Next.js = Frontend / UI
Node.js + Express = Backend / API
MongoDB = Database
JWT = Login Authentication
Tailwind CSS = UI Styling
Socket.IO = Realtime Updates
localStorage = Browser me temporary/persistent data
```

Simple flow:

```text
User UI par action karta hai
        ↓
Next.js event handler
        ↓
fetch() se Backend API call
        ↓
Node.js / Express
        ↓
MongoDB
        ↓
JSON response
        ↓
setState()
        ↓
UI automatically update
```

Realtime me:

```text
Backend par kuch change
        ↓
Socket.IO emit()
        ↓
Frontend socket.on()
        ↓
React state update
        ↓
Page refresh ke bina UI update
```

---

Ye hamara practical frontend learning project hai jisme hum use kar rahe hain **Next.js + React + TypeScript + Tailwind CSS + Fetch API + Socket.IO Client + React Hot Toast**.

Ye frontend hamare Node.js + Express backend se connect hota hai. Is project me humne ye sab banaya hai:

- Manager Login
- Employee Login
- Manager Dashboard
- Employee Dashboard
- Employee CRUD
- Task Create / Assign
- Task List / View / Edit / Delete
- Employee My Tasks
- Status Update
- Filters
- Pagination
- Confirmation Modals
- Toast Notifications
- Socket.IO Realtime Updates
- LocalStorage-based Notification Persistence

---

## 1. Frontend Project Overview

**Frontend folder:**

```text
team-task-manager/
└── frontend/
```

**Frontend me kya-kya use kiya:**

```text
Next.js
React
TypeScript
Tailwind CSS
Fetch API
Socket.IO Client
React Hot Toast
LocalStorage
```

**Frontend ka kaam:**

```text
Browser UI
   ↓
Next.js Pages / Components
   ↓
Fetch API
   ↓
Node.js Backend
   ↓
MongoDB
```

Realtime:

```text
Backend Socket.IO
   ↓
socket.io-client
   ↓
React State Update
   ↓
Toast / Notification / Dashboard Count / Task List
```

---

## 2. Create Next.js Project

Command:

```bash
npx create-next-app@latest frontend
```

Setup karte time ye options select kiye:

```text
TypeScript
ESLint
Tailwind CSS
App Router
No src directory
```

Extra packages install karo:

```bash
npm install react-hot-toast
npm install socket.io-client
```

Frontend run karne ke liye:

```bash
npm run dev
```

Frontend normally yaha chalega:

```text
http://localhost:3001
```

Backend:

```text
http://localhost:3000
```

---

## 3. Important Frontend Folder Structure

```text
frontend/
│
├── app/
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── manager/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   │
│   │   └── tasks/
│   │       ├── page.tsx
│   │       ├── create/
│   │       │   └── page.tsx
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── edit/
│   │               └── page.tsx
│   │
│   └── employee/
│       ├── layout.tsx
│       ├── dashboard/
│       │   └── page.tsx
│       └── tasks/
│           ├── page.tsx
│           └── [id]/
│               └── page.tsx
│
├── components/
│   ├── ConfirmDeleteModal.tsx
│   └── ConfirmActionModal.tsx
│
├── lib/
│   ├── api.ts
│   └── socket.ts
│
├── public/
│
├── .env.local
├── package.json
└── tsconfig.json
```

---

## 4. Next.js App Router Concept

Next.js App Router me simple rule:

```text
folder name = route
page.tsx = page
layout.tsx = common layout
```

Example:

```text
app/manager/dashboard/page.tsx
```

URL:

```text
/manager/dashboard
```

Example:

```text
app/manager/tasks/[id]/page.tsx
```

URL:

```text
/manager/tasks/123
```

`[id]` dynamic route hai, matlab yaha actual task/employee ki ID aayegi.

---

## 5. `page.tsx` Meaning

In traditional PHP:

```text
index.php
```

can be compared roughly to:

```text
page.tsx
```

But Next.js routing is folder-based.

Example:

```text
app/employee/tasks/page.tsx
```

means:

```text
/employee/tasks
```

You normally do not rename `page.tsx`, because Next.js App Router expects this special filename.

---

## 6. `layout.tsx` Meaning

`layout.tsx` common wrapper hai. Matlab jo UI multiple child pages par same chahiye wo yaha rakhte hain.

Example:

```text
app/employee/layout.tsx
```

can contain:

```text
Header
Navigation
Notification Bell
Logout
```

Then:

```tsx
{
  children;
}
```

renders the current child page.

Flow:

```text
employee/layout.tsx
      ↓
Common Header
      ↓
{children}
      ↓
dashboard/page.tsx
or
tasks/page.tsx
```

---

## 7. `"use client"`

Next.js App Router me components default server components hote hain.

If we use:

```text
useState
useEffect
localStorage
window
event handlers
useRouter
Socket.IO client
```

to file ke top par ye add karna padega:

```tsx
"use client";
```

at the top.

Example:

```tsx
"use client";

import { useState } from "react";
```

---

## 8. TypeScript Basics Used

Example:

```tsx
type Employee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};
```

Isse TypeScript ko pata chalta hai Employee object ke andar kaun-kaun se fields aur unke types honge.

Task:

```tsx
type Task = {
  _id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "working" | "hold" | "completed";
};
```

Fayda:

```text
Better autocomplete
Early error detection
Safer code
Clear object structure
```

---

## 9. React `useState()`

`useState()` changing UI data ko state me rakhta hai.

Example:

```tsx
const [tasks, setTasks] = useState<Task[]>([]);
```

Matlab:

```text
tasks
→ current data

setTasks()
→ update data
```

Example:

```tsx
setTasks(data.tasks);
```

Jaise hi state change hoti hai React UI ko automatically re-render kar deta hai.

Another example:

```tsx
const [loading, setLoading] = useState(true);
```

Useful states:

```text
loading
error
tasks
employees
selectedTask
selectedStatus
notifications
showNotifications
```

---

## 10. React `useEffect()`

`useEffect()` side-effect code ke liye use hota hai, jaise API call ya Socket listener.

Example:

```tsx
useEffect(() => {
  fetchTasks();
}, []);
```

`[]` means:

```text
run once when component mounts
```

Example with dependencies:

```tsx
useEffect(() => {
  fetchTasks();
}, [page, selectedEmployee, selectedDate]);
```

Matlab:

```text
page changed
OR
employee filter changed
OR
date filter changed
      ↓
fetchTasks() runs again
```

---

## 11. `useRouter()`

Page navigation ke liye use hota hai.

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
```

Navigate:

```tsx
router.push("/manager/tasks");
```

Example:

```text
Button Click
   ↓
router.push()
   ↓
New page
```

---

## 12. `useParams()`

Dynamic URL ki ID read karne ke liye.

Example:

```text
/employee/tasks/123
```

Code:

```tsx
const params = useParams();

const id = params.id as string;
```

Result:

```text
id = "123"
```

---

## 13. `useSearchParams()`

URL ke query/filter parameters read karne ke liye.

Example URL:

```text
/employee/tasks?status=pending
```

Code:

```tsx
const searchParams = useSearchParams();

const status = searchParams.get("status") || "";
```

Result:

```text
status = pending
```

---

## 14. Common API Configuration

Har file me URL hardcode mat karo:

```text
http://localhost:3000/api
```

har file me.

`lib/api.ts`:

```ts
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const API_URL = `${BASE_URL}/api`;
```

`.env.local`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Usage:

```tsx
import { API_URL } from "@/lib/api";
```

Example:

```tsx
fetch(`${API_URL}/tasks`);
```

---

## 15. Why `BASE_URL` and `API_URL` Both?

REST API:

```text
http://localhost:3000/api
```

Socket.IO:

```text
http://localhost:3000
```

So:

```text
BASE_URL
→ Socket.IO

API_URL
→ REST API
```

---

## 16. Fetch API

Simple GET API:

```tsx
const response = await fetch(`${API_URL}/tasks`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
```

Flow:

```text
fetch()
   ↓
Backend API
   ↓
Response
   ↓
response.json()
   ↓
JavaScript object
```

---

## 17. POST Request

Example Assign Task:

```tsx
const response = await fetch(`${API_URL}/tasks`, {
  method: "POST",

  headers: {
    "Content-Type": "application/json",

    Authorization: `Bearer ${token}`,
  },

  body: JSON.stringify({
    title,
    description,
    assignedTo,
    priority,
    dueDate,
  }),
});
```

Yaad rakho:

```text
JSON.stringify()
→ JS object ko JSON string me convert karta hai
```

---

## 18. PUT vs PATCH

Edit task:

```text
PUT /api/tasks/:id
```

Status update:

```text
PATCH /api/employee/tasks/:id/status
```

Reason:

```text
PUT
→ general/full update

PATCH
→ partial/specific field update
```

Example:

```json
{
  "status": "working"
}
```

---

## 19. JWT Token in Frontend

Login success response:

```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "role": "manager"
  }
}
```

Save:

```tsx
localStorage.setItem("token", data.token);

localStorage.setItem("user", JSON.stringify(data.user));
```

Use token:

```tsx
const token = localStorage.getItem("token");
```

Header:

```tsx
Authorization: `Bearer ${token}`;
```

---

## 20. Login Role Redirect

After login:

```text
manager
→ /manager/dashboard

employee
→ /employee/dashboard
```

Example:

```tsx
if (data.user.role === "manager") {
  router.push("/manager/dashboard");
} else {
  router.push("/employee/dashboard");
}
```

---

## 21. Logout

```tsx
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push("/login");
};
```

Isse login authentication data remove ho jata hai.

Notification history can remain because it uses separate user-specific storage keys.

---

## 22. Manager Dashboard Flow

```text
Manager Dashboard Open
      ↓
GET /api/employees
GET /api/tasks
      ↓
setEmployees()
setTasks()
      ↓
React renders counts
```

Counts:

```tsx
const totalEmployees = employees.length;
```

Pending:

```tsx
const pendingTasks = tasks.filter((task) => task.status === "pending").length;
```

Working:

```tsx
const workingTasks = tasks.filter((task) => task.status === "working").length;
```

Completed:

```tsx
const completedTasks = tasks.filter(
  (task) => task.status === "completed",
).length;
```

---

## 23. Employee Dashboard Flow

```text
Employee Dashboard
      ↓
GET /api/employee/tasks
      ↓
setTasks()
      ↓
Status cards
```

Cards:

```text
Pending
Working
Hold
Completed
```

Click:

```tsx
router.push("/employee/tasks?status=pending");
```

---

## 24. Employee CRUD Frontend Flow

```text
Employee List
   ↓
GET /api/employees

Add Employee
   ↓
POST /api/employees

View Employee
   ↓
GET /api/employees/:id

Edit Employee
   ↓
PUT /api/employees/:id

Delete Employee
   ↓
Confirm Modal
   ↓
DELETE /api/employees/:id
```

---

## 25. Task Create / Assign Flow

Manager form fields:

```text
Task Title
Description
Employee Dropdown
Priority
Due Date
```

Submit:

```text
POST /api/tasks
```

Body:

```json
{
  "title": "Create Dashboard",
  "description": "Create employee dashboard",
  "assignedTo": "EMPLOYEE_ID",
  "priority": "high",
  "dueDate": "2026-08-21"
}
```

Backend handles:

```text
assignedBy = logged-in manager
status = pending
assignDate = current date
```

---

## 26. Employee Dropdown

Employees load from API:

```tsx
const response = await fetch(`${API_URL}/employees`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

Then:

```tsx
employees.map((employee) => (
  <option key={employee._id} value={employee._id}>
    {employee.name}
  </option>
));
```

---

## 27. Task List Filtering

Manager task list filters:

```text
Employee
Assign Date
```

Frontend query:

```tsx
const params = new URLSearchParams();

params.set("page", page.toString());

params.set("limit", "10");
```

Employee filter:

```tsx
if (selectedEmployee) {
  params.set("employeeId", selectedEmployee);
}
```

Date:

```tsx
if (selectedDate) {
  params.set("date", selectedDate);
}
```

Final:

```tsx
fetch(`${API_URL}/tasks?${params.toString()}`);
```

---

## 28. Pagination

Backend response:

```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 4,
    "totalTasks": 35,
    "limit": 10
  }
}
```

Frontend:

```tsx
const [page, setPage] = useState(1);

const [totalPages, setTotalPages] = useState(1);
```

Next:

```tsx
setPage(page + 1);
```

Previous:

```tsx
setPage(page - 1);
```

---

## 29. Employee Task Priority Filter

Employee list:

```text
All
High
Medium
Low
```

Filter:

```tsx
result = result.filter((task) => task.priority === priority);
```

---

## 30. Task Sorting

Employee tasks sort by:

```text
1. Due date nearest first
2. Same due date → high priority first
```

Example priority map:

```tsx
const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};
```

Sort:

```tsx
result.sort((a, b) => {
  const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;

  const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

  if (dateA !== dateB) {
    return dateA - dateB;
  }

  return priorityOrder[a.priority] - priorityOrder[b.priority];
});
```

---

## 31. `useMemo()`

Useful when filtering/sorting derived data.

```tsx
const filteredTasks = useMemo(() => {
  // filtering
  // sorting

  return result;
}, [tasks, status, priority]);
```

Matlab:

```text
Only recalculate when
tasks/status/priority changes
```

---

## 32. Confirmation Modal

Reusable component:

```text
components/
└── ConfirmActionModal.tsx
```

Use:

```tsx
<ConfirmActionModal
    isOpen={showConfirm}
    title="Update Task Status"
    message="Are you sure?"
    confirmText="Yes, Update"
    loading={updateLoading}
    onCancel={...}
    onConfirm={...}
/>
```

Kaam:

```text
API directly call nahi
      ↓
First confirmation
      ↓
User confirms
      ↓
API call
```

---

## 33. Delete Confirmation Modal

Reusable:

```text
ConfirmDeleteModal.tsx
```

Flow:

```text
Delete click
   ↓
selectedTask / selectedEmployee state
   ↓
Modal open
   ↓
Confirm
   ↓
DELETE API
   ↓
Toast
   ↓
List refresh
```

---

## 34. Toast Notifications

Package:

```bash
npm install react-hot-toast
```

Import:

```tsx
import toast, { Toaster } from "react-hot-toast";
```

Success:

```tsx
toast.success("Task updated successfully");
```

Error:

```tsx
toast.error("Unable to update task");
```

Global:

```tsx
<Toaster
  position="top-right"
  toastOptions={{
    duration: 5000,
  }}
/>
```

---

## 35. Socket.IO Client Setup

`lib/socket.ts`:

```ts
import { io } from "socket.io-client";
import { BASE_URL } from "@/lib/api";

export const socket = io(BASE_URL, {
  autoConnect: false,
});
```

`autoConnect: false`:

```text
Import hote hi connect nahi
Manual socket.connect()
```

---

## 36. Socket.IO Rule

```text
Sender   = emit()
Receiver = on()
```

Employee joins room:

```tsx
socket.emit("join-employee", user.id);
```

Backend:

```js
socket.on("join-employee", (employeeId) => {
  // join room
});
```

Manager receives status:

```tsx
socket.on("task-status-updated", handleTaskStatusUpdate);
```

---

## 37. Employee Socket Flow

```text
Employee Login
   ↓
employee/layout.tsx
   ↓
socket.connect()
   ↓
connect event
   ↓
emit("join-employee", user.id)
   ↓
Backend joins employee room
```

New task:

```text
Manager assigns task
   ↓
Backend emit("new-task")
   ↓
Employee layout on("new-task")
   ↓
Toast
   ↓
Notification
   ↓
Dashboard count update
   ↓
Task list update
```

---

## 38. Manager Socket Flow

```text
Manager Login
   ↓
manager/layout.tsx
   ↓
socket.connect()
   ↓
emit("join-manager", managerId)
```

Employee status update:

```text
Employee PATCH status
   ↓
Backend emit("task-status-updated")
   ↓
Manager layout
   ↓
Toast
```

Manager dashboard:

```text
same event
   ↓
setTasks()
   ↓
Dashboard counts update
   ↓
Notification state update
```

Manager task list:

```text
same event
   ↓
matching taskId
   ↓
status update
```

---

## 39. Realtime State Update Without Refresh

Example:

```tsx
setTasks((previousTasks) =>
  previousTasks.map((task) =>
    task._id === data.taskId
      ? {
          ...task,
          status: data.status,
        }
      : task,
  ),
);
```

Matlab:

```text
Find matching task
      ↓
Keep old task fields
      ↓
Overwrite status only
      ↓
React re-render
```

---

## 40. Spread Operator `...`

Example:

```tsx
{
    ...task,
    status: "working"
}
```

Matlab:

```text
Copy all task properties
+
overwrite status
```

Before:

```json
{
  "title": "Task A",
  "priority": "high",
  "status": "pending"
}
```

After:

```json
{
  "title": "Task A",
  "priority": "high",
  "status": "working"
}
```

---

## 41. Notification System

Employee notification:

```text
Manager assigns task
      ↓
new-task
      ↓
New Task Assigned
```

Manager notification:

```text
Employee updates status
      ↓
task-status-updated
      ↓
Kiran updated "Dashboard Task" to working
```

---

## 42. Read / Unread Notifications

Notification type:

```tsx
type Notification = {
  id: string;
  title: string;
  message: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
};
```

Unread:

```text
read = false
light blue background
blue dot
bell badge count
```

Read:

```text
read = true
light gray background
no badge count
```

---

## 43. Mark Single Notification Read

```tsx
setNotifications((previousNotifications) =>
  previousNotifications.map((item) =>
    item.id === notification.id
      ? {
          ...item,
          read: true,
        }
      : item,
  ),
);
```

Yaad rakho:

```text
Only clicked notification changes
Other notifications remain
```

---

## 44. Why Notifications Disappeared Before

Earlier notifications existed only in:

```tsx
useState([]);
```

Flow:

```text
Dashboard
→ notification state exists

Task detail page
→ Dashboard unmounts

Back to Dashboard
→ new component instance
→ useState([])

Result:
notifications gone
```

Fix:

```text
localStorage persistence
```

---

## 45. Notification LocalStorage Persistence

Manager:

```text
manager_notifications
```

Better for multiple managers:

```text
manager_notifications_<managerId>
```

Employee:

```text
employee_notifications_<employeeId>
```

Example:

```text
employee_notifications_111
employee_notifications_222
```

Isse Employee A ki notification Employee B ko nahi dikhegi.

---

## 46. Save Notifications to LocalStorage

```tsx
useEffect(() => {
  if (!notificationsLoaded) {
    return;
  }

  localStorage.setItem(notificationKey, JSON.stringify(notifications));
}, [notifications, notificationsLoaded]);
```

---

## 47. Load Notifications from LocalStorage

```tsx
const saved = localStorage.getItem(notificationKey);

if (saved) {
  setNotifications(JSON.parse(saved));
}
```

---

## 48. Why `notificationsLoaded` State?

Without it:

```text
Initial state = []
      ↓
save effect runs
      ↓
old localStorage notifications overwritten by []
```

So:

```text
first load old notifications
then allow save
```

---

## 49. User-Specific Notification Key

```tsx
return `employee_notifications_${currentUser.id}`;
```

Why:

```text
Employee A
→ own notifications

Employee B
→ own notifications
```

Same browser, different users, no notification mixing.

---

## 50. Tailwind CSS Basics Used

Tailwind uses utility classes.

Example:

```tsx
className="
    bg-white
    rounded-2xl
    shadow-sm
    border
    border-slate-200
    p-6
"
```

Matlab:

```text
bg-white
→ white background

rounded-2xl
→ rounded corners

shadow-sm
→ small shadow

border
→ border

border-slate-200
→ border color

p-6
→ padding
```

---

## 51. Tailwind Responsive Classes

Example:

```tsx
grid - cols - 1;
md: grid - cols - 2;
xl: grid - cols - 4;
```

Matlab:

```text
Mobile
→ 1 column

Medium screen
→ 2 columns

Extra large screen
→ 4 columns
```

---

## 52. Tailwind Hover

```tsx
hover: bg - indigo - 50;
hover: text - indigo - 600;
```

Mouse hover par ye classes apply hoti hain.

---

## 53. Tailwind Flex

```tsx
className="
    flex
    items-center
    justify-between
"
```

Matlab:

```text
flex
→ Flexbox

items-center
→ vertically center

justify-between
→ left/right space
```

---

## 54. Tailwind Grid

```tsx
className="
    grid
    grid-cols-1
    md:grid-cols-2
    gap-5
"
```

Dashboard cards aur forms ke layout me use hota hai.

---

## 55. Tailwind Width Limitation Issue

This:

```tsx
max-w-4xl
```

limits content width.

For full screen:

```tsx
w - full;
```

Employee Task Detail page ko full width karte time ye point kaam aaya tha.

---

## 56. Conditional Tailwind Classes

Priority example:

```tsx
className={
    task.priority === "high"

        ? "bg-red-100 text-red-700"

        : task.priority === "medium"

        ? "bg-yellow-100 text-yellow-700"

        : "bg-green-100 text-green-700"
}
```

---

## 57. Optional Chaining `?.`

Example:

```tsx
task.assignedTo?.name;
```

Matlab:

```text
If assignedTo exists
→ read name

If null/undefined
→ do not crash
```

---

## 58. `||` Fallback

```tsx
task.assignedTo?.name || "Unknown";
```

Matlab:

```text
If name exists
→ name

Otherwise
→ Unknown
```

---

## 59. Date Formatting

Backend date:

```text
2026-08-21T00:00:00.000Z
```

HTML date input requires:

```text
2026-08-21
```

So:

```tsx
task.dueDate.split("T")[0];
```

Display:

```tsx
new Date(task.dueDate).toLocaleDateString();
```

Notification:

```tsx
new Date(notification.createdAt).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
```

---

## 60. Common Frontend Error — CORS

Error:

```text
blocked by CORS policy
```

Cause:

```text
Frontend = port 3001
Backend  = port 3000
```

Browser considers them different origins.

Fix:

```text
Backend CORS configuration
```

---

## 61. Common Error — `Unexpected token '<'`

Error:

```text
Unexpected token '<'
"<!DOCTYPE..."
```

Matlab:

```text
Frontend expects JSON
but server returned HTML
```

Usually:

```text
wrong API route
wrong method
404
wrong server URL
```

---

## 62. Common Error — HTTP Method Mismatch

Frontend:

```text
PATCH /status
```

Backend:

```text
PUT /status
```

Result:

```text
404
```

Fix:

```text
same URL
same method
```

Final status API:

```text
PATCH /api/employee/tasks/:id/status
```

---

## 63. Common Socket Error — Wrong Payload Shape

Backend event:

```js
{
  (taskId, employeeId, status);
}
```

Frontend incorrectly:

```tsx
data.task.status;
```

Result:

```text
undefined
```

Correct:

```tsx
data.status;
```

Lesson:

> Backend and frontend must agree on event payload structure.

---

## 64. Common Socket Error — `disconnect()`

We use one shared socket:

```text
lib/socket.ts
```

If a child page does:

```tsx
socket.disconnect();
```

it can break realtime behavior for layout/dashboard/task list.

Prefer:

```tsx
socket.off("event-name", handler);
```

---

## 65. Exact Socket Listener Cleanup

Good:

```tsx
const handleEvent =
    (data: any) => {
        ...
    };

socket.on(
    "new-task",
    handleEvent
);

return () => {

    socket.off(
        "new-task",
        handleEvent
    );

};
```

This removes only that exact listener.

---

## 66. Realtime Employee Dashboard Update

Manager assigns task:

```text
new-task
   ↓
setTasks([
    data.task,
    ...previousTasks
])
   ↓
pending count +1
```

Code:

```tsx
setTasks((previousTasks) => [data.task, ...previousTasks]);
```

---

## 67. Realtime Employee Task List Update

Same event:

```text
new-task
   ↓
new task row appears
```

If current filter is:

```text
status=pending
```

new pending task appears automatically.

If current filter is:

```text
status=working
```

new pending task stays in state but not visible due to filter.

Ye correct behavior hai.

---

## 68. Realtime Manager Dashboard Count Update

Employee:

```text
pending → working
```

Backend event:

```js
{
    taskId,
    status: "working"
}
```

Frontend updates matching task.

Then counts recalculate:

```text
Pending 5 → 4
Working 2 → 3
```

---

## 69. Realtime Manager Task List Update

```tsx
setTasks((previousTasks) =>
  previousTasks.map((task) =>
    task._id === data.taskId
      ? {
          ...task,
          status: data.status,
        }
      : task,
  ),
);
```

No page refresh needed.

---

## 70. Frontend Request Flow

```text
User Click
   ↓
React Event Handler
   ↓
Validation
   ↓
Fetch API
   ↓
Node Backend
   ↓
MongoDB
   ↓
JSON Response
   ↓
setState()
   ↓
UI Re-render
```

Realtime:

```text
Backend emit()
   ↓
Frontend socket.on()
   ↓
setState()
   ↓
UI Re-render
```

---

## 71. Manager Frontend Final Flow

```text
Manager Login
   ↓
Dashboard
   ↓
Employee CRUD
   ↓
Assign Task
   ↓
Task List
   ↓
View / Edit / Delete
   ↓
Realtime Employee Status Updates
   ↓
Toast
   ↓
Notification
   ↓
Dashboard Count Update
   ↓
Task List Update
```

---

## 72. Employee Frontend Final Flow

```text
Employee Login
   ↓
Dashboard
   ↓
Status Cards
   ↓
My Tasks
   ↓
Priority Filter
   ↓
Due Date Sort
   ↓
View Task
   ↓
Status Update
   ↓
Confirmation
   ↓
PATCH API
   ↓
Toast
   ↓
Dashboard Redirect
```

Manager assigns new task:

```text
Socket.IO new-task
   ↓
Toast
   ↓
Notification
   ↓
Pending count update
   ↓
Task list update
```

---

## 73. Important Status Values

Use same values everywhere:

```text
pending
working
hold
completed
```

Avoid mismatch like:

```text
complete
completed
```

because filter/count can fail.

---

## 74. Current Frontend Progress

```text
Next.js Setup                       ✅
TypeScript                          ✅
Tailwind CSS                        ✅

Login UI                            ✅
Manager / Employee Redirect         ✅
JWT LocalStorage                    ✅

Manager Layout                      ✅
Manager Dashboard                   ✅
Manager Employee CRUD               ✅
Manager Task CRUD                   ✅
Assign Task                         ✅
Task Filters                        ✅
Pagination                          ✅

Employee Layout                     ✅
Employee Dashboard                  ✅
Status Cards                        ✅
My Tasks List                       ✅
Priority Filter                     ✅
Due Date Sorting                    ✅
Task Detail                         ✅
Status Update                       ✅
Confirmation Modal                  ✅

Toast Notifications                 ✅
Reusable Delete Modal               ✅
Reusable Action Modal               ✅

Socket.IO Client                    ✅
Manager → Employee Realtime         ✅
Employee → Manager Realtime         ✅
Realtime Dashboard Counts           ✅
Realtime Task List Updates          ✅

Employee Notification Bell          ✅
Manager Notification Bell           ✅
Read / Unread Notifications         ✅
Notification LocalStorage           ✅
Employee-specific Storage Keys      ✅

Pending / Optional:

Auth Route Guard Refinement          ⏸
Responsive Mobile Polish             ⏸
Automated Frontend Tests             ⏸
Redux / Global State                 ⏸
Persistent DB Notifications          ⏸
Production Deployment                ⏸
```

---

## 75. Redux — Do We Need It?

Apna current project Redux ke bina bhi properly chal sakta hai.

We are using:

```text
useState
useEffect
localStorage
Socket.IO
```

Redux becomes useful when:

```text
many pages need same shared data
complex global state
large app
many nested components
```

Apne current learning project ke liye:

```text
Redux = optional
```

---

## 76. React vs Next.js Learning

Next.js React ka framework hai.

So while learning Next.js, you are also using React concepts:

```text
Components
Props
useState
useEffect
Events
Conditional Rendering
Array map/filter
State updates
```

Next.js start karne se pehle poora React finish karna compulsory nahi hai, lekin React ke basic concepts strong hone chahiye.

---

## 77. Useful JavaScript Methods Learned

### `map()`

```tsx
tasks.map((task) => <div>{task.title}</div>);
```

List UI render karne ke liye.

### `filter()`

```tsx
tasks.filter((task) => task.status === "pending");
```

Filtering aur counts ke liye.

### `find()`

```tsx
const item = tasks.find((task) => task._id === id);
```

Array me ek matching item find karne ke liye.

### `JSON.stringify()`

```tsx
JSON.stringify(data);
```

Object → JSON string.

### `JSON.parse()`

```tsx
JSON.parse(savedUser);
```

JSON string → object.

---

## 78. Important Learning Summary

```text
page.tsx
→ route page

layout.tsx
→ common wrapper

useState()
→ store changing UI data

useEffect()
→ run side effects

useRouter()
→ navigation

useParams()
→ URL dynamic ID

useSearchParams()
→ query string

fetch()
→ REST API call

localStorage
→ browser persistence

socket.emit()
→ send realtime event

socket.on()
→ receive realtime event

setState()
→ update UI

Tailwind
→ utility CSS

TypeScript
→ safer typed frontend code
```

---

## 79. Final Frontend Architecture

```text
                    User Browser
                         │
                         ▼
                  Next.js App Router
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Manager        Employee       Shared
          │              │              │
          │              │       Components / lib
          │              │              │
          └──────────────┼──────────────┘
                         │
                  Fetch API + Socket.IO
                         │
                         ▼
                 Node.js / Express
                         │
                         ▼
                       MongoDB
```

---

## 80. Recommended Next Frontend Steps

```text
1. Route / Role Protection
2. Better reusable Header components
3. Better reusable Table components
4. Loading skeletons
5. Mobile responsiveness
6. Form validation improvements
7. Error boundary / global API helper
8. Automated tests
9. Optional Redux
10. Production build + deployment
```

Apne learning project ka main Next.js frontend + realtime flow complete hai. Is project se practical full-stack development ke kaafi important concepts cover ho gaye hain.

---

## 81. Interview ke liye 2-Minute Quick Revision

**Q: Next.js kya hai?**  
Next.js React ka framework hai jo routing, layouts, rendering aur full-stack features provide karta hai.

**Q: `page.tsx` kya karta hai?**  
App Router me `page.tsx` actual route/page ko represent karta hai.

**Q: `layout.tsx` kya karta hai?**  
Multiple child pages ka common UI rakhta hai, jaise header, menu, notification bell aur logout.

**Q: `"use client"` kyo lagate hain?**  
Jab component me `useState`, `useEffect`, browser APIs, event handlers, localStorage ya Socket.IO client use karna ho.

**Q: `useState()` kya hai?**  
Component ka changing data/state store karta hai aur update hone par UI re-render hoti hai.

**Q: `useEffect()` kya hai?**  
API calls, Socket listeners aur other side effects handle karne ke liye.

**Q: Tailwind CSS kya hai?**  
Utility-first CSS framework hai jisme ready classes jaise `p-4`, `flex`, `bg-white`, `rounded-xl` se quickly UI banate hain.

**Q: Frontend backend se kaise communicate kar raha hai?**  
Normal CRUD ke liye Fetch API + REST APIs, aur realtime updates ke liye Socket.IO.

**Q: JWT frontend me kaise use hua?**  
Login ke baad token localStorage me save kiya aur protected API requests me `Authorization: Bearer TOKEN` header bheja.

**Q: Socket.IO me `emit()` aur `on()`?**  
`emit()` event send karta hai; `on()` event receive/listen karta hai.

**Q: Notifications user-wise kaise rakhi?**  
Employee ID ke according separate localStorage key use ki:

```text
employee_notifications_<employeeId>
```

Isliye ek employee ki notification dusre employee ko show nahi hoti.

**Q: Redux use kiya?**  
Nahi. Current project ke liye `useState`, `useEffect`, localStorage aur Socket.IO sufficient hain. Large global state hone par Redux future option ho sakta hai.

```

```
