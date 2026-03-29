import React from 'react';
import { motion } from 'framer-motion';
import { Download, Cpu, Map } from 'lucide-react';

const steps = [
  {
    icon: Download,
    title: '1. Save Content',
    desc: 'Easily clip articles, PDF, images, or social posts via browser extensions or mobile app.'
  },
  {
    icon: Cpu,
    title: '2. AI Organizes',
    desc: 'Our engine extracts topics, tags and builds semantic embeddings for advanced discovery.'
  },
  {
    icon: Map,
    title: '3. Rediscover',
    desc: 'Visualize connections and surface relevant memories precisely when you need them.'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Workflow that <span className="text-accent-gradient">Enhances You</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Designed to be seamless and low-friction, Synapse integrates into your existing reading and research habits.
            </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative">
          {/* Animated line for desktop */}
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-linear-to-r from-brand-teal/50 via-brand-cyan/50 to-brand-teal/50 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex-1 relative z-10 text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-brand-900 border-2 border-brand-teal/30 flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-teal/20 transition-all duration-300 transform group-hover:-translate-y-2">
                <step.icon className="w-10 h-10 text-brand-teal" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed px-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
