import { 
  DollarSign, 
  Clock, 
  Globe, 
  Award, 
  Shield, 
  TrendingUp,
  Users,
  Zap,
  Heart,
  Star,
  Rocket,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface FeatureProps {
  onApplyClick: () => void;
}

export function Features({ onApplyClick }: FeatureProps) {
  const features = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Earn $15-50+ per hour based on your expertise and project complexity. Weekly payments directly to your account.",
      gradient: "from-green-500 to-emerald-600",
      stats: "$15-50/hr",
      badge: "Top Pay"
    },
    {
      icon: Clock,
      title: "Ultimate Flexibility",
      description: "Work whenever and wherever you want. Choose projects that match your schedule and interests.",
      gradient: "from-blue-500 to-cyan-600",
      stats: "24/7 Access",
      badge: "Flexible"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access diverse AI training projects from companies worldwide. Work on cutting-edge technology from anywhere.",
      gradient: "from-purple-500 to-pink-600",
      stats: "120+ Countries",
      badge: "Worldwide"
    },
    {
      icon: Award,
      title: "Skill Development",
      description: "Enhance your expertise in AI, machine learning, and data science while earning. Get certified for completed projects.",
      gradient: "from-orange-500 to-red-600",
      stats: "Free Training",
      badge: "Learn & Earn"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and earnings are protected with enterprise-grade security. Transparent payment terms and support.",
      gradient: "from-indigo-500 to-purple-600",
      stats: "Bank-Level",
      badge: "Secure"
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Build a portfolio of AI projects, gain recognition, and unlock higher-paying opportunities as you progress.",
      gradient: "from-pink-500 to-rose-600",
      stats: "Unlimited",
      badge: "Growth"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Expert Community",
      description: "Join 50,000+ professionals",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Fast Onboarding",
      description: "Start earning within 24 hours",
      color: "text-purple-600"
    },
    {
      icon: Heart,
      title: "Supportive Team",
      description: "24/7 dedicated support",
      color: "text-pink-600"
    },
    {
      icon: Star,
      title: "Recognition Program",
      description: "Earn badges and rewards",
      color: "text-yellow-600"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
      
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
          >
            <Rocket className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">Why Choose Us</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Infera AI?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the leading platform for AI training and unlock opportunities that match your expertise and lifestyle
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group overflow-hidden relative">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <CardContent className="p-8 relative z-10">
                  {/* Icon and Badge */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                      {feature.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                    <span className={`text-2xl bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.stats}
                    </span>
                    <motion.div
                      className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 5 }}
                    >
                      <Target className="h-5 w-5" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl text-white mb-4">
                More Reasons to Join Today
              </h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Experience the benefits that set Infera AI apart from other platforms
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="text-lg text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-blue-100">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <motion.button
                onClick={onApplyClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                <span className="flex items-center gap-2">
                  Start Your Journey
                  <Rocket className="h-5 w-5" />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
