"use client";

import { Star, Quote, ChevronLeft, ChevronRight, Briefcase, MapPin } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    location: "San Francisco, CA",
    text: "Taskify has been incredible for supplementing my income. I work on code review projects during evenings and weekends, and the flexibility is unmatched.",
    rating: 5,
    earnings: "$12,450",
    projects: 156,
    image: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTc3ODMyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Marcus Johnson",
    role: "Data Scientist",
    location: "New York, NY",
    text: "The quality of projects and the support from the Taskify team is outstanding. I've grown my skills significantly while earning great income.",
    rating: 5,
    earnings: "$18,920",
    projects: 203,
    image: "https://images.unsplash.com/photo-1758598304704-8dc72fe16003?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTc5MDM3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Emily Rodriguez",
    role: "Content Writer",
    location: "Toronto, Canada",
    text: "I've been with Taskify for 6 months and it's been amazing. The platform is easy to use and payments are always on time.",
    rating: 5,
    earnings: "$9,340",
    projects: 124,
    image: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTcwMzg3MXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "David Kim",
    role: "ML Engineer",
    location: "Seattle, WA",
    text: "Working with Taskify has allowed me to explore cutting-edge AI projects while maintaining my work-life balance. Highly recommended!",
    rating: 5,
    earnings: "$21,560",
    projects: 187,
    image: "https://images.unsplash.com/photo-1758598304704-8dc72fe16003?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTc5MDM3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Priya Patel",
    role: "AI Researcher",
    location: "London, UK",
    text: "The diversity of projects keeps things interesting. I love how I can contribute to meaningful AI development from anywhere in the world.",
    rating: 5,
    earnings: "$16,780",
    projects: 165,
    image: "https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTc3ODMyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = testimonials.length - 1;
      if (newIndex >= testimonials.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6"
          >
            <Star className="h-4 w-4 text-purple-600 fill-purple-600" />
            <span className="text-sm text-purple-600">Testimonials</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            Loved by <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Thousands</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied contributors earning with Taskify
          </p>
        </motion.div>

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div className="relative h-[500px] flex items-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full"
              >
                <Card className="bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Image Side */}
                      <div className="relative h-[500px]">
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Stats Overlay */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="flex gap-4">
                            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-4 flex-1 border border-white/30">
                              <div className="text-2xl text-white mb-1">{testimonials[currentIndex].earnings}</div>
                              <div className="text-xs text-white/80">Total Earnings</div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-4 flex-1 border border-white/30">
                              <div className="text-2xl text-white mb-1">{testimonials[currentIndex].projects}</div>
                              <div className="text-xs text-white/80">Projects</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Side */}
                      <div className="p-12 flex flex-col justify-center">
                        {/* Quote Icon */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="mb-8"
                        >
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <Quote className="h-8 w-8 text-white" />
                          </div>
                        </motion.div>

                        {/* Rating */}
                        <div className="flex gap-1 mb-6">
                          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                            >
                              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="text-xl text-gray-700 mb-8 leading-relaxed italic"
                        >
                          "{testimonials[currentIndex].text}"
                        </motion.p>

                        {/* Author Info */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                        >
                          <h4 className="text-xl text-gray-900 mb-2">
                            {testimonials[currentIndex].name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <Badge variant="outline" className="gap-1">
                              <Briefcase className="h-3 w-3" />
                              {testimonials[currentIndex].role}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {testimonials[currentIndex].location}
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
            <motion.button
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors pointer-events-auto"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors pointer-events-auto"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                whileHover={{ scale: 1.2 }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-gradient-to-r from-purple-600 to-pink-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Grid - All Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-14 w-14 border-2 border-purple-200">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="object-cover w-full h-full rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h4 className="text-base text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <div className="flex gap-0.5 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
