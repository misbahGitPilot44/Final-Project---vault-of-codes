"use client"

import { useState } from "react"
import { Check, Edit3, Trash2, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  dueDate: string
  createdAt: string
}

interface TaskManagementProps {
  effectiveTheme: "dark" | "light"
}

export default function TaskManagement({ effectiveTheme }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Implement user authentication",
      description: "Add JWT-based authentication system",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-01-10",
      createdAt: "2025-01-01",
    },
    {
      id: "2",
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for automated deployment",
      priority: "medium",
      status: "todo",
      dueDate: "2025-01-15",
      createdAt: "2025-01-02",
    },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    dueDate: "",
  })

  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)

  // Task Management Functions
  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: "todo",
        dueDate: newTask.dueDate,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTasks([...tasks, task])
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" })
      setShowAddTask(false)
    }
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskStatus = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const newStatus = task.status === "completed" ? "todo" : task.status === "todo" ? "in-progress" : "completed"
      updateTask(id, { status: newStatus })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600/20 text-green-400"
      case "in-progress":
        return "bg-blue-600/20 text-blue-400"
      case "todo":
        return "bg-gray-600/20 text-gray-400"
      default:
        return "bg-gray-600/20 text-gray-400"
    }
  }

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2 lg:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
          Task Management
        </CardTitle>
        <Button size="sm" onClick={() => setShowAddTask(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus size={16} className="mr-1" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        {/* Add Task Form */}
        {showAddTask && (
          <div className={`p-4 rounded-lg mb-4 ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
            <div className="space-y-3">
              <Input
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className={`${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"}`}
              />
              <Textarea
                placeholder="Task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className={`${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"}`}
                rows={2}
              />
              <div className="flex gap-2">
                <Select
                  value={newTask.priority}
                  onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className={`${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"}`}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addTask} className="bg-green-600 hover:bg-green-700">
                  Add Task
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 rounded-lg border ${effectiveTheme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Button size="sm" variant="ghost" onClick={() => toggleTaskStatus(task.id)} className="p-1 h-6 w-6">
                      <Check size={14} className={task.status === "completed" ? "text-green-500" : "text-gray-400"} />
                    </Button>
                    <h4
                      className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {task.title}
                    </h4>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {task.dueDate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setEditingTask(task.id)} className="p-1 h-6 w-6">
                    <Edit3 size={12} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteTask(task.id)}
                    className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
