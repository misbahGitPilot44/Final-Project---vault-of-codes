"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bell,
  ChevronDown,
  MoreVertical,
  Sun,
  Search,
  Moon,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  X,
  Edit3,
  Trash2,
  Calendar,
  Check,
  Activity,
  Heart,
  Footprints,
  MapPin,
  Flame,
  Music,
  Youtube,
  ExternalLink,
  Camera,
  ImageIcon,
  Download,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import React from "react"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  status: "todo" | "in-progress" | "completed"
  dueDate: string
  createdAt: string
}

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

interface Track {
  id: string
  title: string
  artist: string
  duration: string
  category: "motivational" | "relaxing" | "focus" | "energetic"
  audioUrl?: string
  youtubeId?: string
  type: "generated" | "youtube"
}

interface WorkoutPhoto {
  id: string
  dataUrl: string
  timestamp: string
  exercise: string
}

export default function Dashboard() {
  const [theme, setTheme] = useState<"dark" | "light" | "auto">("dark")
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark")
  const [focusTimer, setFocusTimer] = useState({ minutes: 25, seconds: 0, isRunning: false })

  // Notification System State
  const [notifications, setNotifications] = useState<
    {
      id: string
      type: "motivational" | "exercise" | "progress"
      title: string
      message: string
      timestamp: Date
      read: boolean
    }[]
  >([])

  const [showNotifications, setShowNotifications] = useState(false)

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1)

  // Section mapping for search functionality
  const sections = [
    { id: "task-management", title: "Task Management", keywords: ["task", "tasks", "management", "project", "work"] },
    { id: "todo-list", title: "Quick To-Do List", keywords: ["todo", "to-do", "list", "quick", "notes"] },
    { id: "focus-timer", title: "Focus Timer", keywords: ["focus", "timer", "pomodoro", "concentration", "work"] },
    {
      id: "exercise-tracker",
      title: "Exercise Tracker",
      keywords: ["exercise", "workout", "fitness", "tracker", "health"],
    },
    { id: "workout-music", title: "Workout Music", keywords: ["music", "audio", "songs", "playlist", "workout"] },
    { id: "workout-camera", title: "Workout Camera", keywords: ["camera", "photo", "picture", "capture", "gallery"] },
    { id: "repositories", title: "Active Repositories", keywords: ["repo", "repository", "git", "code", "project"] },
    { id: "daily-progress", title: "Daily Progress", keywords: ["progress", "daily", "stats", "tracking", "goals"] },
    { id: "sprint-progress", title: "Sprint Progress", keywords: ["sprint", "progress", "development", "completion"] },
    { id: "team-work", title: "Team Work", keywords: ["team", "work", "collaboration", "workload"] },
  ]

  // Notification content arrays
  const motivationalQuotes = [
    "You can do it! 💪",
    "Progress, not perfection! 🌟",
    "Small steps every day! 👣",
    "Believe in yourself! ✨",
    "Every workout counts! 🏃‍♂️",
    "Stay consistent, stay strong! 💯",
    "Your only limit is you! 🚀",
    "Make it happen! ⚡",
    "Push yourself, because no one else will! 🔥",
    "Success starts with self-discipline! 🎯",
  ]

  const exerciseReminders = [
    "Time to log your workout! 📝",
    "Have you completed your daily exercise? 🏋️‍♂️",
    "Stretch break! Your body will thank you! 🧘‍♀️",
    "Hydration check! Drink some water! 💧",
    "Time for a quick walk! 🚶‍♂️",
    "Don't forget your warm-up! 🔥",
    "Cool down time! Take it easy! ❄️",
    "Track your progress today! 📊",
    "Set your exercise goal for today! 🎯",
    "Time to move your body! 💃",
  ]

  const progressEncouragement = [
    "You've done great this week! 🌟",
    "Keep pushing! You're on fire! 🔥",
    "Amazing progress! Keep it up! 📈",
    "You're building great habits! 🏗️",
    "Consistency is key - you're nailing it! 🔑",
    "Your dedication is inspiring! ✨",
    "Look how far you've come! 👀",
    "You're stronger than yesterday! 💪",
    "Celebrate your wins! 🎉",
    "Your future self will thank you! 🙏",
  ]

  // Task Management State
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

  // Todo List State
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: "1", text: "Review pull requests", completed: false, createdAt: "2025-01-01" },
    { id: "2", text: "Update documentation", completed: true, createdAt: "2025-01-01" },
    { id: "3", text: "Deploy to staging", completed: false, createdAt: "2025-01-02" },
  ])

  const [newTodo, setNewTodo] = useState("")

  // Exercise State
  const [selectedExercise, setSelectedExercise] = useState<"walking" | "running" | "cycling" | null>(null)
  const [exerciseTimer, setExerciseTimer] = useState({ hours: 0, minutes: 0, seconds: 0, isRunning: false })
  const [exerciseMetrics, setExerciseMetrics] = useState({
    steps: 0,
    distance: 0,
    calories: 0,
    heartRate: 0,
  })
  const [showExerciseSelection, setShowExerciseSelection] = useState(true)
  const [workoutStarted, setWorkoutStarted] = useState(false)

  // Camera and Photo State
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [workoutPhotos, setWorkoutPhotos] = useState<WorkoutPhoto[]>([])
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)

  // Music Player State
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(70)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<
    "motivational" | "relaxing" | "focus" | "energetic"
  >("motivational")
  const [musicMode, setMusicMode] = useState<"generated" | "youtube">("generated")

  // Progress Tracking State
  const [progressData, setProgressData] = useState<{
    daily: { date: string; focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }[]
    weeklyGoals: { focusMinutes: number; exerciseMinutes: number; tasksCompleted: number }
    currentStreak: number
  }>({
    daily: [],
    weeklyGoals: { focusMinutes: 150, exerciseMinutes: 300, tasksCompleted: 10 },
    currentStreak: 0,
  })

  const [todayProgress, setTodayProgress] = useState({
    focusMinutes: 0,
    exerciseMinutes: 0,
    tasksCompleted: 0,
  })

  // Music tracks with both generated and YouTube options
  const musicTracks: Record<string, Track[]> = {
    motivational: [
      {
        id: "m1",
        title: "Motivational Beat 1",
        artist: "AI Generated",
        duration: "3:24",
        category: "motivational",
        type: "generated",
        audioUrl: "/audio/motivational-1.mp3",
      },
      {
        id: "m2",
        title: "Motivational Beat 2",
        artist: "AI Generated",
        duration: "3:07",
        category: "motivational",
        type: "generated",
        audioUrl: "/audio/motivational-2.mp3",
      },
      {
        id: "m3",
        title: "Believer",
        artist: "Imagine Dragons",
        duration: "3:24",
        category: "motivational",
        type: "youtube",
        youtubeId: "LRMLUfJZhWg",
      },
    ],
    relaxing: [
      {
        id: "r1",
        title: "Relaxing Ambient",
        artist: "AI Generated",
        duration: "4:15",
        category: "relaxing",
        type: "generated",
        audioUrl: "/audio/relaxing-1.mp3",
      },
      {
        id: "r2",
        title: "Weightless",
        artist: "Marconi Union",
        duration: "8:10",
        category: "relaxing",
        type: "youtube",
        youtubeId: "UfcAVejslrU",
      },
    ],
    focus: [
      {
        id: "f1",
        title: "Focus Music for Work and Studying",
        artist: "Greenred Productions",
        duration: "9:08:53",
        category: "focus",
        type: "youtube",
        youtubeId: "_4kHxtiuML0",
      },
    ],
    energetic: [
      {
        id: "e1",
        title: "Energetic Workout",
        artist: "AI Generated",
        duration: "2:45",
        category: "energetic",
        type: "generated",
        audioUrl: "/audio/energetic-1.mp3",
      },
      {
        id: "e2",
        title: "Shape Of You",
        artist: "Ed Sheeran",
        duration: "4:23",
        category: "energetic",
        type: "youtube",
        youtubeId: "whkk7V2T80w",
      },
    ],
  }

  // Current playlist based on selected category and mode
  const currentPlaylist = musicTracks[selectedMusicCategory]?.filter((track) => track.type === musicMode) || []
  const currentTrack = currentPlaylist[currentTrackIndex]

  // Load saved photos from localStorage on component mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem("workoutPhotos")
    if (savedPhotos) {
      try {
        setWorkoutPhotos(JSON.parse(savedPhotos))
      } catch (error) {
        console.error("Error loading saved photos:", error)
        localStorage.removeItem("workoutPhotos")
      }
    }
  }, [])

  // Save photos to localStorage whenever workoutPhotos changes
  useEffect(() => {
    try {
      localStorage.setItem("workoutPhotos", JSON.stringify(workoutPhotos))
    } catch (error) {
      console.error("Error saving photos:", error)
    }
  }, [workoutPhotos])

  // Detect system theme preference
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mediaQuery.matches ? "dark" : "light")

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Determine effective theme
  const effectiveTheme = theme === "auto" ? systemTheme : theme

  // Focus Timer Logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (focusTimer.isRunning) {
      interval = setInterval(() => {
        setFocusTimer((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 }
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
          } else {
            return { ...prev, isRunning: false }
          }
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [focusTimer.isRunning])

  // Exercise Timer Logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (exerciseTimer.isRunning) {
      interval = setInterval(() => {
        setExerciseTimer((prev) => {
          const newSeconds = prev.seconds + 1
          if (newSeconds >= 60) {
            const newMinutes = prev.minutes + 1
            if (newMinutes >= 60) {
              return { hours: prev.hours + 1, minutes: 0, seconds: 0, isRunning: true }
            }
            return { ...prev, minutes: newMinutes, seconds: 0 }
          }
          return { ...prev, seconds: newSeconds }
        })

        // Simulate metrics increase
        if (selectedExercise) {
          setExerciseMetrics((prev) => ({
            steps: prev.steps + Math.floor(Math.random() * 3),
            distance: prev.distance + Math.random() * 0.01,
            calories: prev.calories + Math.floor(Math.random() * 2),
            heartRate: 120 + Math.floor(Math.random() * 40),
          }))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [exerciseTimer.isRunning, selectedExercise])

  // Audio time tracking
  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(Math.floor(audio.currentTime))
    const updateDuration = () => setDuration(Math.floor(audio.duration))
    const handleEnded = () => {
      setIsPlaying(false)
      playNextTrack()
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack])

  // Set up audio when track changes
  React.useEffect(() => {
    if (currentTrack && currentTrack.type === "generated" && currentTrack.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = currentTrack.audioUrl
        audioRef.current.load()
      } else {
        audioRef.current = new Audio(currentTrack.audioUrl)
      }
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [currentTrack])

  // Update volume when it changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  // Reset track index when switching modes
  React.useEffect(() => {
    setCurrentTrackIndex(0)
    setIsPlaying(false)
  }, [selectedMusicCategory, musicMode])

  // Automatically suggest music based on exercise type
  useEffect(() => {
    if (selectedExercise) {
      switch (selectedExercise) {
        case "running":
          setSelectedMusicCategory("energetic")
          break
        case "walking":
          setSelectedMusicCategory("relaxing")
          break
        case "cycling":
          setSelectedMusicCategory("motivational")
          break
      }

      setCurrentTrackIndex(0)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [selectedExercise])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      stopCamera()
    }
  }, [])

  // Camera Functions with improved error handling
  const startCamera = async () => {
    try {
      // Stop any existing streams first
      if (videoRef.current && videoRef.current.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream
        existingStream.getTracks().forEach((track) => track.stop())
      }

      // Request camera access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setIsCameraActive(true)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
              })
          }
        }
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error)
      if (error.name === "NotAllowedError") {
        alert("Camera access denied. Please allow camera permissions and try again.")
      } else if (error.name === "NotFoundError") {
        alert("No camera found. Please connect a camera and try again.")
      } else {
        alert("Unable to access camera. Please check your camera and permissions.")
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Flip the image horizontally to match what user sees
        context.scale(-1, 1)
        context.drawImage(video, -canvas.width, 0)

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        const newPhoto: WorkoutPhoto = {
          id: Date.now().toString(),
          dataUrl,
          timestamp: new Date().toLocaleString(),
          exercise: selectedExercise || "workout",
        }

        setWorkoutPhotos((prev) => [newPhoto, ...prev])

        // Show a brief success message
        const button = document.querySelector("[data-capture-button]") as HTMLElement
        if (button) {
          const originalText = button.innerHTML
          button.innerHTML = "✓ Captured!"
          setTimeout(() => {
            button.innerHTML = originalText
          }, 1000)
        }
      }
    }
  }

  const deletePhoto = (photoId: string) => {
    setWorkoutPhotos((prev) => prev.filter((photo) => photo.id !== photoId))
  }

  const downloadPhoto = (photo: WorkoutPhoto) => {
    const link = document.createElement("a")
    link.download = `workout-${photo.exercise}-${photo.timestamp.replace(/[/:]/g, "-")}.jpg`
    link.href = photo.dataUrl
    link.click()
  }

  const toggleTimer = () => {
    setFocusTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const resetTimer = () => {
    if (focusTimer.minutes < 25) {
      // Timer was used, track the progress
      const minutesUsed = 25 - focusTimer.minutes
      updateTodayProgress("focus", minutesUsed)
    }
    setFocusTimer({ minutes: 25, seconds: 0, isRunning: false })
  }

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

      // Track task completion
      if (newStatus === "completed" && task.status !== "completed") {
        updateTodayProgress("task", 1)
      } else if (task.status === "completed" && newStatus !== "completed") {
        updateTodayProgress("task", -1)
      }

      updateTask(id, { status: newStatus })
    }
  }

  // Todo Functions
  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const updateTodoText = (id: string, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
  }

  // Exercise Functions
  const startExercise = (exercise: "walking" | "running" | "cycling") => {
    setSelectedExercise(exercise)
    setShowExerciseSelection(false)
    setWorkoutStarted(true)
    setExerciseTimer({ hours: 0, minutes: 0, seconds: 0, isRunning: true })
    setExerciseMetrics({ steps: 0, distance: 0, calories: 0, heartRate: 0 })
  }

  const stopExercise = () => {
    setExerciseTimer((prev) => ({ ...prev, isRunning: false }))
    stopCamera()
  }

  const resetExercise = () => {
    if (exerciseTimer.minutes > 0 || exerciseTimer.hours > 0) {
      // Exercise was done, track the progress
      const totalMinutes = exerciseTimer.hours * 60 + exerciseTimer.minutes
      updateTodayProgress("exercise", totalMinutes)
    }

    setSelectedExercise(null)
    setShowExerciseSelection(true)
    setWorkoutStarted(false)
    setExerciseTimer({ hours: 0, minutes: 0, seconds: 0, isRunning: false })
    setExerciseMetrics({ steps: 0, distance: 0, calories: 0, heartRate: 0 })
    stopCamera()
  }

  // Music Player Controls
  const togglePlayPause = async () => {
    try {
      if (currentTrack?.type === "generated" && audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          await audioRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    } catch (error) {
      console.log("Audio playback error:", error)
    }
  }

  const playNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % currentPlaylist.length
    setCurrentTrackIndex(nextIndex)
    setCurrentTime(0)
  }

  const playPreviousTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length
    setCurrentTrackIndex(prevIndex)
    setCurrentTime(0)
  }

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0]
    setVolume(volumeValue)
  }

  const changeCategory = (category: "motivational" | "relaxing" | "focus" | "energetic") => {
    setSelectedMusicCategory(category)
    setCurrentTrackIndex(0)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const openYouTubeVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank")
  }

  const getExerciseIcon = (exercise: string) => {
    switch (exercise) {
      case "walking":
        return Footprints
      case "running":
        return Activity
      case "cycling":
        return Activity
      default:
        return Activity
    }
  }

  const getExerciseColor = (exercise: string) => {
    switch (exercise) {
      case "walking":
        return "from-cyan-400 to-cyan-600"
      case "running":
        return "from-blue-400 to-blue-600"
      case "cycling":
        return "from-green-400 to-green-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getMusicCategoryColor = (category: string) => {
    switch (category) {
      case "motivational":
        return "bg-orange-500 hover:bg-orange-600"
      case "relaxing":
        return "bg-teal-500 hover:bg-teal-600"
      case "focus":
        return "bg-indigo-500 hover:bg-indigo-600"
      case "energetic":
        return "bg-rose-500 hover:bg-rose-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Search Functions
  const filterSections = (query: string) => {
    if (!query.trim()) return []

    const lowercaseQuery = query.toLowerCase()
    return sections
      .filter(
        (section) =>
          section.title.toLowerCase().includes(lowercaseQuery) ||
          section.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery)),
      )
      .slice(0, 5) // Limit to 5 results
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSearchResults(value.trim().length > 0)
    setSelectedSearchIndex(-1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const filteredSections = filterSections(searchQuery)

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSearchIndex((prev) => (prev < filteredSections.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSearchIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedSearchIndex >= 0 && filteredSections[selectedSearchIndex]) {
        navigateToSection(filteredSections[selectedSearchIndex].id)
      } else if (filteredSections.length > 0) {
        navigateToSection(filteredSections[0].id)
      }
    } else if (e.key === "Escape") {
      setShowSearchResults(false)
      setSelectedSearchIndex(-1)
    }
  }

  const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      })

      // Add a highlight effect
      element.classList.add("ring-2", "ring-green-400", "ring-opacity-50")
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-green-400", "ring-opacity-50")
      }, 2000)

      // Close search results
      setShowSearchResults(false)
      setSearchQuery("")
      setSelectedSearchIndex(-1)

      // Add notification for successful navigation
      addNotification("progress", "Navigation", `Navigated to ${sections.find((s) => s.id === sectionId)?.title}! 🎯`)
    }
  }

  const handleSearchResultClick = (sectionId: string) => {
    navigateToSection(sectionId)
  }

  // Progress Tracking Functions
  const updateTodayProgress = (type: "focus" | "exercise" | "task", value: number) => {
    const today = new Date().toISOString().split("T")[0]

    setTodayProgress((prev) => {
      const updated = { ...prev }
      if (type === "focus") updated.focusMinutes += value
      if (type === "exercise") updated.exerciseMinutes += value
      if (type === "task") updated.tasksCompleted += value

      // Update daily progress data
      setProgressData((prevData) => {
        const newDaily = [...prevData.daily]
        const todayIndex = newDaily.findIndex((d) => d.date === today)

        if (todayIndex >= 0) {
          newDaily[todayIndex] = {
            date: today,
            focusMinutes: updated.focusMinutes,
            exerciseMinutes: updated.exerciseMinutes,
            tasksCompleted: updated.tasksCompleted,
          }
        } else {
          newDaily.push({
            date: today,
            focusMinutes: updated.focusMinutes,
            exerciseMinutes: updated.exerciseMinutes,
            tasksCompleted: updated.tasksCompleted,
          })
        }

        // Keep only last 7 days
        const last7Days = newDaily.slice(-7)

        return { ...prevData, daily: last7Days }
      })

      return updated
    })
  }

  const calculateStreak = () => {
    const sortedData = progressData.daily.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0

    for (const day of sortedData) {
      if (day.focusMinutes > 0 || day.exerciseMinutes > 0 || day.tasksCompleted > 0) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100)
  }

  // Notification Functions
  const addNotification = (type: "motivational" | "exercise" | "progress", title: string, message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]) // Keep only 10 most recent
  }

  const generateMotivationalNotification = () => {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    addNotification("motivational", "Daily Motivation", quote)
  }

  const generateExerciseReminder = () => {
    const reminder = exerciseReminders[Math.floor(Math.random() * exerciseReminders.length)]
    addNotification("exercise", "Exercise Reminder", reminder)
  }

  const generateProgressEncouragement = () => {
    const encouragement = progressEncouragement[Math.floor(Math.random() * progressEncouragement.length)]
    addNotification("progress", "Progress Update", encouragement)
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "motivational":
        return "💪"
      case "exercise":
        return "🏃‍♂️"
      case "progress":
        return "📈"
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "motivational":
        return "text-yellow-400"
      case "exercise":
        return "text-green-400"
      case "progress":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  // Load progress data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("userProgress")
    const savedTodayProgress = localStorage.getItem("todayProgress")

    if (savedProgress) {
      try {
        setProgressData(JSON.parse(savedProgress))
      } catch (error) {
        console.error("Error loading progress data:", error)
      }
    }

    if (savedTodayProgress) {
      try {
        const parsed = JSON.parse(savedTodayProgress)
        const today = new Date().toISOString().split("T")[0]

        // Only load today's progress if it's actually from today
        if (parsed.date === today) {
          setTodayProgress(parsed.progress)
        }
      } catch (error) {
        console.error("Error loading today's progress:", error)
      }
    }
  }, [])

  // Save progress data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("userProgress", JSON.stringify(progressData))
    } catch (error) {
      console.error("Error saving progress data:", error)
    }
  }, [progressData])

  // Save today's progress to localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(
        "todayProgress",
        JSON.stringify({
          date: today,
          progress: todayProgress,
        }),
      )
    } catch (error) {
      console.error("Error saving today's progress:", error)
    }
  }, [todayProgress])

  // Automatic Notification Generation
  useEffect(() => {
    // Generate initial welcome notification
    setTimeout(() => {
      addNotification("motivational", "Welcome Back!", "Ready to crush your goals today? 🚀")
    }, 2000)

    // Generate motivational quotes every 15 minutes
    const motivationalInterval = setInterval(
      () => {
        generateMotivationalNotification()
      },
      15 * 60 * 1000,
    ) // 15 minutes

    // Generate exercise reminders every 30 minutes
    const exerciseInterval = setInterval(
      () => {
        generateExerciseReminder()
      },
      30 * 60 * 1000,
    ) // 30 minutes

    // Generate progress encouragement every hour
    const progressInterval = setInterval(
      () => {
        generateProgressEncouragement()
      },
      60 * 60 * 1000,
    ) // 1 hour

    return () => {
      clearInterval(motivationalInterval)
      clearInterval(exerciseInterval)
      clearInterval(progressInterval)
    }
  }, [])

  // Context-based notifications
  useEffect(() => {
    // Notification when user completes a task
    const completedTasks = tasks.filter((t) => t.status === "completed").length
    if (completedTasks > 0) {
      const lastCompletedCount = Number.parseInt(localStorage.getItem("lastCompletedTasks") || "0")
      if (completedTasks > lastCompletedCount) {
        setTimeout(() => {
          addNotification(
            "progress",
            "Task Completed!",
            `Great job! You've completed ${completedTasks} task${completedTasks > 1 ? "s" : ""} today! 🎉`,
          )
        }, 1000)
        localStorage.setItem("lastCompletedTasks", completedTasks.toString())
      }
    }
  }, [tasks])

  useEffect(() => {
    // Notification when user starts exercising
    if (exerciseTimer.isRunning && exerciseTimer.seconds === 1 && exerciseTimer.minutes === 0) {
      addNotification("exercise", "Workout Started!", `Great choice! You're doing ${selectedExercise}. Keep it up! 💪`)
    }

    // Notification for workout milestones
    if (
      exerciseTimer.isRunning &&
      exerciseTimer.minutes > 0 &&
      exerciseTimer.minutes % 5 === 0 &&
      exerciseTimer.seconds === 0
    ) {
      addNotification(
        "progress",
        "Milestone Reached!",
        `${exerciseTimer.minutes} minutes of ${selectedExercise}! You're doing amazing! 🔥`,
      )
    }
  }, [exerciseTimer, selectedExercise])

  useEffect(() => {
    // Notification when focus timer completes
    if (!focusTimer.isRunning && focusTimer.minutes === 0 && focusTimer.seconds === 0) {
      addNotification("progress", "Focus Session Complete!", "Well done! Take a short break and stay hydrated! 🧠✨")
    }
  }, [focusTimer])

  return (
    <div
      className={`min-h-screen ${effectiveTheme === "dark" ? "bg-[#0d1525] text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Main Content */}
      <div className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 py-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
            </div>
            <span className="text-2xl font-semibold text-green-400">DevFlow</span>
          </div>

          <div className="relative max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
            <Input
              placeholder="Search sections... (e.g., Task Management, Focus Timer)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className={`pl-10 pr-4 py-2 ${effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700 text-gray-300" : "bg-white border-gray-300 text-gray-900"} rounded-full focus:ring-green-500 focus:border-green-500 w-full`}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 ${
                  effectiveTheme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                } border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto`}
              >
                {filterSections(searchQuery).length > 0 ? (
                  <>
                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">Search Results</div>
                    {filterSections(searchQuery).map((section, index) => (
                      <div
                        key={section.id}
                        onClick={() => handleSearchResultClick(section.id)}
                        className={`px-3 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                          index === selectedSearchIndex
                            ? effectiveTheme === "dark"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-green-100 text-green-700"
                            : effectiveTheme === "dark"
                              ? "hover:bg-gray-800 text-gray-200"
                              : "hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            section.id === "task-management"
                              ? "bg-green-500"
                              : section.id === "todo-list"
                                ? "bg-blue-500"
                                : section.id === "focus-timer"
                                  ? "bg-orange-500"
                                  : section.id === "exercise-tracker"
                                    ? "bg-cyan-500"
                                    : section.id === "workout-music"
                                      ? "bg-purple-500"
                                      : section.id === "workout-camera"
                                        ? "bg-pink-500"
                                        : section.id === "repositories"
                                          ? "bg-yellow-500"
                                          : section.id === "daily-progress"
                                            ? "bg-indigo-500"
                                            : section.id === "sprint-progress"
                                              ? "bg-red-500"
                                              : "bg-gray-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{section.title}</div>
                          <div className="text-xs text-gray-400">{section.keywords.slice(0, 3).join(", ")}</div>
                        </div>
                        <div className="text-xs text-gray-500">{index === selectedSearchIndex ? "↵" : ""}</div>
                      </div>
                    ))}
                    <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-700 bg-gray-800/30">
                      Use ↑↓ to navigate, ↵ to select, Esc to close
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-4 text-center text-gray-400">
                    <Search size={24} className="mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No sections found</div>
                    <div className="text-xs mt-1">Try "Task", "Focus", "Exercise", or "Music"</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400">
                  {theme === "dark" ? (
                    <Moon size={20} />
                  ) : theme === "light" ? (
                    <Sun size={20} />
                  ) : (
                    <div className="relative">
                      <Sun size={20} />
                      <Moon size={12} className="absolute -top-1 -right-1" />
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun size={16} />
                    Light
                  </div>
                  {theme === "light" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon size={16} />
                    Dark
                  </div>
                  {theme === "dark" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("auto")} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sun size={16} />
                      <Moon size={10} className="absolute -top-0.5 -right-0.5" />
                    </div>
                    Auto
                  </div>
                  {theme === "auto" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-green-400 relative">
                  <Bell size={20} />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full text-xs flex items-center justify-center animate-pulse">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-80 max-h-96 overflow-y-auto ${
                  effectiveTheme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <div className="p-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-200">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllNotifications}
                        className="text-xs text-gray-400 hover:text-gray-200"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                    <p className="text-xs mt-1">We'll notify you about your progress!</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`p-3 border-b border-gray-700/50 hover:bg-gray-800/50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-gray-800/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-lg ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-medium text-sm ${
                                  effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                            </div>
                            <p className="text-sm text-gray-400 mb-1">{notification.message}</p>
                            <p className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {notifications.length > 0 && (
                  <div className="p-2 border-t border-gray-700">
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        {notifications.filter((n) => !n.read).length} unread of {notifications.length} total
                      </span>
                    </div>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar className="h-9 w-9 border-2 border-green-500">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9WBdfMgwzpbUGkTu3eNAANmJpJmpTW.png"
                alt="User"
              />
              <AvatarFallback>DV</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Task Management - 1st section */}
          <Card
            id="task-management"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 lg:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Task Management
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowAddTask(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
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
                      className={`${
                        effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                      }`}
                    />
                    <Textarea
                      placeholder="Task description..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className={`${
                        effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                      }`}
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
                        className={`${
                          effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                        }`}
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
                    className={`p-3 rounded-lg border ${
                      effectiveTheme === "dark" ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleTaskStatus(task.id)}
                            className="p-1 h-6 w-6"
                          >
                            <Check
                              size={14}
                              className={task.status === "completed" ? "text-green-500" : "text-gray-400"}
                            />
                          </Button>
                          <h4
                            className={`font-medium ${
                              task.status === "completed"
                                ? "line-through text-gray-500"
                                : effectiveTheme === "dark"
                                  ? "text-gray-200"
                                  : "text-gray-800"
                            }`}
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingTask(task.id)}
                          className="p-1 h-6 w-6"
                        >
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

          {/* To-Do List - 2nd section */}
          <Card
            id="todo-list"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 lg:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Quick To-Do List
              </CardTitle>
              <Badge className="bg-blue-600/20 text-blue-400">{todos.filter((t) => !t.completed).length} pending</Badge>
            </CardHeader>
            <CardContent>
              {/* Add Todo */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a quick task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  className={`${
                    effectiveTheme === "dark" ? "bg-gray-900/50 border-gray-700" : "bg-white border-gray-300"
                  }`}
                />
                <Button size="sm" onClick={addTodo} className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} />
                </Button>
              </div>

              {/* Todo List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center gap-2 p-2 rounded ${
                      effectiveTheme === "dark" ? "hover:bg-gray-800/50" : "hover:bg-gray-100"
                    }`}
                  >
                    <Button size="sm" variant="ghost" onClick={() => toggleTodo(todo.id)} className="p-1 h-6 w-6">
                      <Check size={14} className={todo.completed ? "text-green-500" : "text-gray-400"} />
                    </Button>
                    <Input
                      value={todo.text}
                      onChange={(e) => updateTodoText(todo.id, e.target.value)}
                      className={`flex-1 border-none bg-transparent p-0 h-auto ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : effectiveTheme === "dark"
                            ? "text-gray-200"
                            : "text-gray-800"
                      }`}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Focus Timer - 3rd section */}
          <Card
            id="focus-timer"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Focus Timer
              </CardTitle>
              <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <Timer className="h-10 w-10 text-orange-400" />
                    <div>
                      <h3
                        className={`text-lg font-medium ${
                          effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Pomodoro Session
                      </h3>
                      <p className="text-orange-400">Deep Work Mode</p>
                      <p className="text-gray-400 text-sm">Stay focused & productive</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-orange-400">
                    {String(focusTimer.minutes).padStart(2, "0")}:{String(focusTimer.seconds).padStart(2, "0")}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={toggleTimer} className="bg-orange-500 hover:bg-orange-600">
                      {focusTimer.isRunning ? <Pause size={14} /> : <Play size={14} />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetTimer}>
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Tracker - 4th section */}
          <Card
            id="exercise-tracker"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Exercise Tracker
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 h-8 w-8"
                  onClick={() => setShowPhotoGallery(!showPhotoGallery)}
                >
                  <ImageIcon size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                  <Activity size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showExerciseSelection ? (
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm mb-4">Choose your workout</p>

                  {/* Exercise Selection */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => startExercise("walking")}
                      className="w-full h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white justify-start px-4"
                    >
                      <Footprints size={24} className="mr-3" />
                      <span className="text-lg font-medium">WALKING</span>
                    </Button>

                    <Button
                      onClick={() => startExercise("running")}
                      className="w-full h-16 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white justify-start px-4"
                    >
                      <Activity size={24} className="mr-3" />
                      <span className="text-lg font-medium">RUNNING</span>
                    </Button>

                    <Button
                      onClick={() => startExercise("cycling")}
                      className="w-full h-16 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white justify-start px-4"
                    >
                      <Activity size={24} className="mr-3" />
                      <span className="text-lg font-medium">CYCLING</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Exercise Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedExercise &&
                        React.createElement(getExerciseIcon(selectedExercise), {
                          size: 20,
                          className: "text-green-400",
                        })}
                      <span className="text-lg font-medium text-green-400 uppercase">{selectedExercise}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={
                          exerciseTimer.isRunning
                            ? stopExercise
                            : () => setExerciseTimer((prev) => ({ ...prev, isRunning: true }))
                        }
                        className="bg-green-500 hover:bg-green-600"
                      >
                        {exerciseTimer.isRunning ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={resetExercise}>
                        <RotateCcw size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Timer Display */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-4">
                      {String(exerciseTimer.hours).padStart(2, "0")}:{String(exerciseTimer.minutes).padStart(2, "0")}:
                      {String(exerciseTimer.seconds).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Footprints size={16} className="text-cyan-400" />
                        <span className="text-sm text-gray-400">Steps</span>
                      </div>
                      <div className="text-xl font-bold text-white">{exerciseMetrics.steps}</div>
                    </div>

                    <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={16} className="text-blue-400" />
                        <span className="text-sm text-gray-400">Km</span>
                      </div>
                      <div className="text-xl font-bold text-white">{exerciseMetrics.distance.toFixed(1)}</div>
                    </div>

                    <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Flame size={16} className="text-orange-400" />
                        <span className="text-sm text-gray-400">Kcal</span>
                      </div>
                      <div className="text-xl font-bold text-white">{exerciseMetrics.calories}</div>
                    </div>

                    <div className={`p-3 rounded-lg ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Heart size={16} className="text-red-400" />
                        <span className="text-sm text-gray-400">Bpm</span>
                      </div>
                      <div className="text-xl font-bold text-white">{exerciseMetrics.heartRate}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Workout Music Player - 5th section */}
          <Card
            id="workout-music"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Workout Music
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setMusicMode(musicMode === "generated" ? "youtube" : "generated")}
                  className={`${
                    musicMode === "generated" ? "bg-purple-500 hover:bg-purple-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {musicMode === "generated" ? "AI Music" : "YouTube"}
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                  <Music size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Music Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  size="sm"
                  onClick={() => changeCategory("motivational")}
                  className={`${
                    selectedMusicCategory === "motivational"
                      ? getMusicCategoryColor("motivational")
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Motivational
                </Button>
                <Button
                  size="sm"
                  onClick={() => changeCategory("relaxing")}
                  className={`${
                    selectedMusicCategory === "relaxing"
                      ? getMusicCategoryColor("relaxing")
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Relaxing
                </Button>
                <Button
                  size="sm"
                  onClick={() => changeCategory("focus")}
                  className={`${
                    selectedMusicCategory === "focus" ? getMusicCategoryColor("focus") : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Focus
                </Button>
                <Button
                  size="sm"
                  onClick={() => changeCategory("energetic")}
                  className={`${
                    selectedMusicCategory === "energetic"
                      ? getMusicCategoryColor("energetic")
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Energetic
                </Button>
              </div>

              {/* Now Playing */}
              <div className={`p-4 rounded-lg mb-4 ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg ${getMusicCategoryColor(
                      selectedMusicCategory,
                    )} flex items-center justify-center ${isPlaying ? "animate-pulse" : ""}`}
                  >
                    {musicMode === "generated" ? (
                      <Music size={24} className={`text-white ${isPlaying ? "animate-pulse" : ""}`} />
                    ) : (
                      <Youtube size={24} className={`text-white ${isPlaying ? "animate-pulse" : ""}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                      {currentTrack?.title || "Select a track"}
                    </h3>
                    <p className="text-sm text-gray-400">{currentTrack?.artist || "Artist"}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {musicMode === "generated" ? "AI Generated" : "YouTube"}
                      </Badge>
                      <span>{currentTrack?.duration || "--:--"}</span>
                    </div>
                  </div>
                  {isPlaying && <div className="text-green-400 text-sm font-medium">♪ Playing</div>}
                </div>

                {/* Audio Controls for Generated Music */}
                {musicMode === "generated" && currentTrack && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Button size="sm" onClick={playPreviousTrack} variant="outline" className="p-2 bg-transparent">
                        <SkipBack size={14} />
                      </Button>
                      <Button size="sm" onClick={togglePlayPause} className="bg-green-500 hover:bg-green-600 p-2">
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Button size="sm" onClick={playNextTrack} variant="outline" className="p-2 bg-transparent">
                        <SkipForward size={14} />
                      </Button>
                      <div className="flex items-center gap-2 flex-1">
                        <Volume2 size={14} className="text-gray-400" />
                        <Slider
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-gray-400 w-8">{volume}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <Progress value={(currentTime / duration) * 100} className="flex-1 h-1" />
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}

                {/* YouTube Embed for YouTube mode */}
                {musicMode === "youtube" && currentTrack?.youtubeId && (
                  <div className="mt-4">
                    <iframe
                      width="100%"
                      height="200"
                      src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=0&controls=1`}
                      title={currentTrack.title}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Playlist */}
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {currentPlaylist.map((track, index) => (
                  <div
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      currentTrackIndex === index
                        ? effectiveTheme === "dark"
                          ? "bg-gray-700"
                          : "bg-gray-200"
                        : effectiveTheme === "dark"
                          ? "hover:bg-gray-800/70"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full ${getMusicCategoryColor(
                          track.category,
                        )} flex items-center justify-center`}
                      >
                        {currentTrackIndex === index && isPlaying ? (
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        ) : musicMode === "generated" ? (
                          <Music size={12} className="text-white" />
                        ) : (
                          <Youtube size={12} className="text-white" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{track.duration}</span>
                      {musicMode === "youtube" && track.youtubeId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            openYouTubeVideo(track.youtubeId!)
                          }}
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                        >
                          <ExternalLink size={12} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workout Camera - 6th section */}
          <Card
            id="workout-camera"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Workout Camera
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 h-8 w-8"
                  onClick={() => setShowPhotoGallery(!showPhotoGallery)}
                >
                  <ImageIcon size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                  <Camera size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Camera Section */}
              {!isCameraActive ? (
                <div className="text-center space-y-4">
                  <div
                    className={`p-8 rounded-lg border-2 border-dashed ${
                      effectiveTheme === "dark" ? "border-gray-700 bg-gray-800/30" : "border-gray-300 bg-gray-100"
                    }`}
                  >
                    <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3
                      className={`text-lg font-medium mb-2 ${
                        effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Capture Your Workout
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Take photos during your exercise sessions and build your fitness journey gallery
                    </p>
                    <Button onClick={startCamera} className="bg-purple-500 hover:bg-purple-600 text-white">
                      <Camera size={16} className="mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-80 bg-black rounded-lg object-cover shadow-lg border-2 border-purple-500"
                      style={{ transform: "scaleX(-1)" }}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button
                        onClick={capturePhoto}
                        data-capture-button
                        className="bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16 p-0 shadow-lg"
                      >
                        <Camera size={24} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                      <X size={16} className="mr-2" />
                      Stop Camera
                    </Button>
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {showPhotoGallery && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-300 flex items-center gap-2">
                      <ImageIcon size={18} />
                      Workout Gallery ({workoutPhotos.length})
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPhotoGallery(false)}
                      className="text-gray-400"
                    >
                      <X size={14} />
                    </Button>
                  </div>

                  {workoutPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {workoutPhotos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.dataUrl || "/placeholder.svg"}
                            alt={`Workout ${photo.exercise}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-700"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => downloadPhoto(photo)}
                              className="text-white p-2 h-8 w-8 bg-green-500/80 hover:bg-green-500"
                            >
                              <Download size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deletePhoto(photo.id)}
                              className="text-white p-2 h-8 w-8 bg-red-500/80 hover:bg-red-500"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/80 px-2 py-1 rounded">
                            {photo.exercise}
                          </div>
                          <div className="absolute top-2 right-2 text-xs text-white bg-black/80 px-2 py-1 rounded">
                            {new Date(photo.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`text-center py-8 ${
                        effectiveTheme === "dark" ? "bg-gray-800/30" : "bg-gray-100"
                      } rounded-lg`}
                    >
                      <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 text-sm">No workout photos yet</p>
                      <p className="text-gray-500 text-xs mt-1">Start capturing your fitness journey!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div
                  className={`p-3 rounded-lg text-center ${
                    effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <div className="text-2xl font-bold text-purple-400">{workoutPhotos.length}</div>
                  <div className="text-xs text-gray-400">Total Photos</div>
                </div>
                <div
                  className={`p-3 rounded-lg text-center ${
                    effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-400">
                    {workoutPhotos.filter((p) => p.timestamp.includes(new Date().toLocaleDateString())).length}
                  </div>
                  <div className="text-xs text-gray-400">Today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Repositories */}
          <Card
            id="repositories"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 lg:col-span-4 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Active Repositories
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Last Commit</span>
                <Button variant="outline" size="sm" className="h-8 border-gray-700 bg-gray-800/50 text-gray-300">
                  <ChevronDown size={14} className="ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
                  <Check size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      devflow-frontend
                    </span>
                    <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress value={85} className="h-2 flex-1" />
                    <span className="ml-4 text-gray-400 text-sm">2h ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  <Check size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      api-gateway
                    </span>
                    <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">Review</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress value={65} className="h-2 flex-1" />
                    <span className="ml-4 text-gray-400 text-sm">5h ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                  <Check size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      devops-pipeline
                    </span>
                    <Badge className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30">Deploy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <Progress value={92} className="h-2 flex-1" />
                    <span className="ml-4 text-gray-400 text-sm">1h ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section - NEW Dynamic Progress */}
          <Card
            id="daily-progress"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 lg:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Daily Progress
              </CardTitle>
              <Badge className="bg-purple-600/20 text-purple-400">{calculateStreak()} day streak</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Today's Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{todayProgress.focusMinutes}</div>
                    <div className="text-xs text-gray-400">Focus Min</div>
                    <Progress
                      value={getProgressPercentage(
                        todayProgress.focusMinutes,
                        progressData.weeklyGoals.focusMinutes / 7,
                      )}
                      className="h-1 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{todayProgress.exerciseMinutes}</div>
                    <div className="text-xs text-gray-400">Exercise Min</div>
                    <Progress
                      value={getProgressPercentage(
                        todayProgress.exerciseMinutes,
                        progressData.weeklyGoals.exerciseMinutes / 7,
                      )}
                      className="h-1 mt-1"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{todayProgress.tasksCompleted}</div>
                    <div className="text-xs text-gray-400">Tasks Done</div>
                    <Progress
                      value={getProgressPercentage(
                        todayProgress.tasksCompleted,
                        progressData.weeklyGoals.tasksCompleted / 7,
                      )}
                      className="h-1 mt-1"
                    />
                  </div>
                </div>

                {/* Weekly Progress Chart */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-400 mb-3">7-Day Activity</h4>
                  <div className="flex items-end justify-between gap-2 h-20">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - (6 - i))
                      const dateStr = date.toISOString().split("T")[0]

                      const dayData = progressData.daily.find((d) => d.date === dateStr)
                      const totalActivity =
                        (dayData?.focusMinutes || 0) +
                        (dayData?.exerciseMinutes || 0) +
                        (dayData?.tasksCompleted || 0) * 10
                      const maxActivity = 100 // Normalize to 100 for display
                      const height = Math.min((totalActivity / maxActivity) * 100, 100)

                      const isToday = dateStr === new Date().toISOString().split("T")[0]

                      return (
                        <div key={i} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-full rounded-md transition-all duration-300 ${
                              height > 70
                                ? "bg-green-500"
                                : height > 40
                                  ? "bg-blue-500"
                                  : height > 0
                                    ? "bg-yellow-500"
                                    : "bg-gray-700"
                            } ${isToday ? "ring-2 ring-purple-400" : ""}`}
                            style={{ height: `${Math.max(height, 8)}%` }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-1">
                            {date.toLocaleDateString("en", { weekday: "short" })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Weekly Goals */}
                <div className="mt-4 p-3 rounded-lg bg-gray-800/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Weekly Goals</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Focus Time</span>
                      <span className="text-xs text-orange-400">
                        {progressData.daily.reduce((sum, day) => sum + (day.focusMinutes || 0), 0)} /{" "}
                        {progressData.weeklyGoals.focusMinutes} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Exercise</span>
                      <span className="text-xs text-green-400">
                        {progressData.daily.reduce((sum, day) => sum + (day.exerciseMinutes || 0), 0)} /{" "}
                        {progressData.weeklyGoals.exerciseMinutes} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Tasks</span>
                      <span className="text-xs text-blue-400">
                        {progressData.daily.reduce((sum, day) => sum + (day.tasksCompleted || 0), 0)} /{" "}
                        {progressData.weeklyGoals.tasksCompleted}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sprint Progress - Updated */}
          <Card
            id="sprint-progress"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Sprint Progress
              </CardTitle>
              <Button variant="ghost" size="icon" className="text-gray-400 h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <h2 className={`text-4xl font-bold ${effectiveTheme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
                  {tasks.filter((t) => t.status === "completed").length}
                </h2>
                <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">
                  +
                  {tasks.length > 0
                    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
                    : 0}
                  %
                </Badge>
                <span className="text-gray-400 text-sm">tasks completed</span>
              </div>
              <div className="mt-6 flex items-end justify-between gap-2 h-20">
                {[60, 80, 95, 70, 85, 90, 100].map((value, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-md ${i >= 4 ? "bg-green-500" : i >= 2 ? "bg-blue-500" : "bg-gray-700"}`}
                    style={{ height: `${value}%` }}
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Workload */}
          <Card
            id="team-work"
            className={`${
              effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"
            } col-span-1 md:col-span-2 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle
                className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}
              >
                Team Work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400">Frontend</span>
                    <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      45%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-gray-400">Backend</span>
                    <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      32%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-gray-400">DevOps</span>
                    <span className={`ml-auto ${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      23%
                    </span>
                  </div>
                </div>
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${effectiveTheme === "dark" ? "text-gray-100" : "text-gray-900"}`}
                      >
                        {tasks.filter((t) => t.status !== "completed").length}
                      </div>
                      <div className="text-xs text-gray-400">Active</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#1f2937" strokeWidth="2"></circle>
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeDashoffset="25"
                      transform="rotate(-90 18 18)"
                    ></circle>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
