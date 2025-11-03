import { UserPlus, FileCheck, Briefcase, DollarSign, ArrowRight, CheckCircle, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface HowItWorksProps {
  onGetStartedClick: () => void;
}

export function HowItWorks({ onGetStartedClick }: HowItWorksProps) {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up & Complete Profile",
      description: "Create your account in minutes and showcase your expertise. Tell us about your skills, experience, and areas of interest.",
      time: "5 minutes",
      gradient: "from-blue-500 to-cyan-600",
      features: ["Quick registration", "Skill assessment", "Profile verification"]
    },
    {
      icon: FileCheck,
      title: "Get Verified",
      description: "Complete a short qualification test to demonstrate your capabilities. This ensures you're matched with the right projects.",
      time: "1-2 hours",
      gradient: "from-purple-500 to-pink-600",
      features: ["Skills test", "Background check", "Quality review"]
    },
    {
      icon: Briefcase,
      title: "Choose Projects",
      description: "Browse available opportunities and select projects that match your skills and schedule. Start working immediately.",
      time: "Instant",
      gradient: "from-orange-500 to-red-600",
      features: ["Diverse projects", "Flexible hours", "Real-time updates"]
    },
    {
      icon: DollarSign,
      title: "Earn & Grow",
      description: "Complete tasks, maintain high quality, and get paid weekly. Build your reputation and unlock premium opportunities.",
      time: "Weekly",
      gradient: "from-green-500 to-emerald-600",
      features: ["Weekly payments", "Performance bonuses", "Career advancement"]
    }
  ];

  const benefits = [
    { icon: Clock, text: "Start earning within 24 hours" },
    { icon: Award, text: "No experience required for entry-level tasks" },
    { icon: CheckCircle, text: "Guaranteed payment for completed work" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDIiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
          >
            <Briefcase className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600">Simple Process</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl text-gray-900 mb-6">
            How <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in just 4 simple steps and start earning within 24 hours
          </p>
        </motion.div>

        {/* Steps with Connecting Lines */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20"></div>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-2xl transition-all group relative overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                  <CardContent className="p-8 relative z-10">
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 -right-3">
                      <motion.div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg text-white text-xl`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        {index + 1}
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    {/* Time Badge */}
                    <Badge className="mb-4 bg-gray-100 text-gray-700 hover:bg-gray-100">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.time}
                    </Badge>

                    {/* Title & Description */}
                    <h3 className="text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.2 + idx * 0.1 }}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* Arrow Indicator - Desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center"
                      >
                        <ArrowRight className={`h-5 w-5 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
                      </motion.div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl text-white mb-4">
                Why Thousands Choose Us
              </h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Join a thriving community of experts earning competitive income on their own terms
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-center"
                >
                  <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-white">{benefit.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.button
                onClick={onGetStartedClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-blue-600 rounded-xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-3 group"
              >
                <span className="text-lg">Get Started Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <p className="text-blue-100 text-sm mt-4">No credit card required • Free to join</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
