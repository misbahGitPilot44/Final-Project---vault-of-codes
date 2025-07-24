"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, ImageIcon, Trash2, Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WorkoutPhoto {
  id: string
  dataUrl: string
  timestamp: string
  exercise: string
}

interface WorkoutCameraProps {
  effectiveTheme: "dark" | "light"
  selectedExercise: string | null
}

export default function WorkoutCamera({ effectiveTheme, selectedExercise }: WorkoutCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [workoutPhotos, setWorkoutPhotos] = useState<WorkoutPhoto[]>([])
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)

  // Load saved photos from localStorage on component mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem("workoutPhotos")
    if (savedPhotos) {
      setWorkoutPhotos(JSON.parse(savedPhotos))
    }
  }, [])

  // Save photos to localStorage whenever workoutPhotos changes
  useEffect(() => {
    localStorage.setItem("workoutPhotos", JSON.stringify(workoutPhotos))
  }, [workoutPhotos])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

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
    } catch (error) {
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

        // Create a new Image to handle CORS issues
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
          const newPhoto: WorkoutPhoto = {
            id: Date.now().toString(),
            dataUrl,
            timestamp: new Date().toLocaleString(),
            exercise: selectedExercise || "workout",
          }

          setWorkoutPhotos((prev) => [newPhoto, ...prev])
        }
        img.src = canvas.toDataURL("image/jpeg", 0.8)
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

  return (
    <Card
      className={`${effectiveTheme === "dark" ? "bg-[#131e32] border-gray-800" : "bg-white border-gray-200"} col-span-1 md:col-span-2`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`${effectiveTheme === "dark" ? "text-gray-300" : "text-gray-700"} text-lg font-medium`}>
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
              className={`p-8 rounded-lg border-2 border-dashed ${effectiveTheme === "dark" ? "border-gray-700 bg-gray-800/30" : "border-gray-300 bg-gray-100"}`}
            >
              <Camera size={48} className="mx-auto text-gray-400 mb-4" />
              <h3
                className={`text-lg font-medium mb-2 ${effectiveTheme === "dark" ? "text-gray-200" : "text-gray-800"}`}
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
                  className="bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16 p-0 shadow-lg"
                >
                  <Camera size={24} />
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={stopCamera} variant="outline" className="flex-1">
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
              <Button size="sm" variant="ghost" onClick={() => setShowPhotoGallery(false)} className="text-gray-400">
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
                className={`text-center py-8 ${effectiveTheme === "dark" ? "bg-gray-800/30" : "bg-gray-100"} rounded-lg`}
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
          <div className={`p-3 rounded-lg text-center ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
            <div className="text-2xl font-bold text-purple-400">{workoutPhotos.length}</div>
            <div className="text-xs text-gray-400">Total Photos</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${effectiveTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}`}>
            <div className="text-2xl font-bold text-green-400">
              {workoutPhotos.filter((p) => p.timestamp.includes(new Date().toLocaleDateString())).length}
            </div>
            <div className="text-xs text-gray-400">Today</div>
          </div>
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  )
}
