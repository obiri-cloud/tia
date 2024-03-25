import React, { ReactNode, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import dockerfile from "highlight.js/lib/languages/dockerfile";
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("bash", bash);

interface ILandLab {
  label: string;
  value: string;
  icon: ReactNode;
  sm_icon: ReactNode;
  file_name: string;
  code: string;
  language: string;
}

const Codes = () => {
  const terraform_code = `
    terraform {
      required_providers {
        aws = {
          source  = "hashicorp/aws"
          version = "~> 1.0.4"
        }
      }
    }
    
    variable "aws_region" {}
    
    variable "base_cidr_block" {
      description = "A /16 CIDR range definition, such as 10.1.0.0/16, that the VPC will use"
      default = "10.1.0.0/16"
    }
    
    variable "availability_zones" {
      description = "A list of availability zones in which to create subnets"
      type = list(string)
    }
    
    provider "aws" {
      region = var.aws_region
    }
    
    resource "aws_vpc" "main" {
      # Referencing the base_cidr_block variable allows the network address
      # to be changed without modifying the configuration.
      cidr_block = var.base_cidr_block
    }
    
    resource "aws_subnet" "az" {
      # Create one subnet for each given availability zone.
      count = length(var.availability_zones)
    
      # For each subnet, use one of the specified availability zones.
      availability_zone = var.availability_zones[count.index]
    
      # By referencing the aws_vpc.main object, Terraform knows that the subnet
      # must be created only after the VPC is created.
      vpc_id = aws_vpc.main.id
    
      # Built-in functions and operators can be used for simple transformations of
      # values, such as computing a subnet address. Here we create a /20 prefix for
      # each subnet, using consecutive addresses for each availability zone,
      # such as 10.1.16.0/20 .
      cidr_block = cidrsubnet(aws_vpc.main.cidr_block, 4, count.index+1)
    }
    
    
    `;

  const k8s_code = `
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: nginx-deployment
    labels:
      app: nginx
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: nginx
    template:
      metadata:
        labels:
          app: nginx
      spec:
        containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
          - containerPort: 80
    `;

  const docker_code = `
  # Use the official Nginx base image
  FROM nginx
  
  # Copy custom configuration file to the container
  COPY nginx.conf /etc/nginx/nginx.conf
  
  # (Optional) Copy static content to the web server directory
  COPY /path/to/your/static/files /usr/share/nginx/html
  
  # Expose the port Nginx is listening on
  EXPOSE 80
  
  # Start Nginx when the container launches
  CMD ["nginx", "-g", "daemon off;"]
    `;

  const bash_code = `
  #!/bin/bash
  
  # A simple bash script
  
  # Define variables
  NAME="John"
  AGE=30
  
  # Print a greeting
  echo "Hello, $NAME! You are $AGE years old."
  
  # Check if the user is old enough
  if [ $AGE -ge 18 ]; then
    echo "You are old enough to vote."
  else
    echo "You are not old enough to vote yet."
  fi
  
  # List files in the current directory
  echo "Listing files in the current directory:"
  ls -l
    `;

  const ansible_code = `
  - name: Install and Configure Nginx
    hosts: your_server
    become: yes  # Allows privilege escalation
  
    tasks:
      - name: Update apt package manager cache (for Debian-based systems)
        apt:
          update_cache: yes
        when: ansible_os_family == 'Debian'  # Conditional task for Debian-based systems
  
      - name: Install Nginx
        package:
          name: nginx
          state: present  # Ensure the package is present
  
      - name: Copy Nginx configuration file
        copy:
          src: /path/to/your/local/nginx.conf  # Path to your local nginx.conf
          dest: /etc/nginx/nginx.conf  # Destination on the remote server
        notify: Restart Nginx  # Notify the handler to restart Nginx if the file changes
  
    handlers:
      - name: Restart Nginx
        service:
          name: nginx
          state: restarted  # Restart the Nginx service
    `;

  const argocd_code = `
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: sample-app
    namespace: argocd  # Replace with your target namespace
  spec:
    destination:
      server: 'https://kubernetes.default.svc'  # Replace with your Kubernetes API server address
      namespace: default  # Replace with your target namespace
    project: default
    source:
      repoURL: 'https://github.com/your-username/your-repo.git'  # Replace with your Git repository URL
      targetRevision: HEAD  # Replace with the branch, tag, or commit ID you want to deploy
      path: /path/to/your/app  # Replace with the path within the repo where your app manifests are located
      helm:
        valueFiles:
          - values.yaml  # Add any specific Helm values files if needed
    syncPolicy:
      automated:
        prune: true  # Enable automatic pruning of resources not defined in Git
        selfHeal: true  # Enable automatic self-healing of resources
  
  
    `;

  const [highlightedCode, setHighlightedCode] = useState(
    hljs.highlight(k8s_code, {
      language: "yaml",
    }).value
  );

  const labs: ILandLab[] = [
    {
      label: "Terraform",
      value: "terraform",
      icon: <i className="devicon-terraform-plain  colored text-[30px]"></i>,
      sm_icon: <i className="devicon-terraform-plain  colored text-[20px]"></i>,
      file_name: "main.tf",
      code: terraform_code,
      language: "yaml",
    },
    {
      label: "K8s",
      value: "k8s",
      icon: <i className="devicon-kubernetes-plain colored text-[30px]"></i>,
      sm_icon: <i className="devicon-kubernetes-plain colored text-[20px]"></i>,
      file_name: "deployment.yaml",
      code: k8s_code,
      language: "yaml",
    },
    {
      label: "Dockerfile",
      value: "dockerfile",
      icon: (
        <i className="devicon-docker-plain-wordmark colored text-[30px]"></i>
      ),
      sm_icon: (
        <i className="devicon-docker-plain-wordmark colored text-[20px]"></i>
      ),
      file_name: "Dockerfile",
      code: docker_code,
      language: "dockerfile",
    },
    {
      label: "Bash Scripting",
      value: "bash",
      icon: <i className="devicon-bash-plain  dark:colored text-[30px]"></i>,
      sm_icon: <i className="devicon-bash-plain  dark:colored text-[20px]"></i>,
      file_name: "install.sh",
      code: bash_code,
      language: "bash",
    },
    {
      label: "Ansible",
      value: "ansible",
      icon: <i className="devicon-ansible-plain dark:colored text-[30px]"></i>,
      sm_icon: (
        <i className="devicon-ansible-plain dark:colored text-[20px]"></i>
      ),
      file_name: "playbook.yaml",
      code: ansible_code,
      language: "yaml",
    },
    {
      label: "ArgoCD",
      value: "argo-cd",
      icon: <i className="devicon-argocd-plain colored text-[30px]"></i>,
      sm_icon: <i className="devicon-argocd-plain colored text-[20px]"></i>,
      file_name: "playbook.yaml",
      code: argocd_code,
      language: "yaml",
    },
  ];

  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [currentLab, setCurrentLab] = useState(labs[0]);

  const handleLabClick = (data: ILandLab) => {
    setCurrentLab(data);
    setHighlightedCode(
      hljs.highlight(data.code, {
        language: data.language,
      }).value
    );
  };

  return (
    <div className="py-5">
      <h1 className="jss26 jss130 max-w-[950px]">
        Get ready to enhance your DevOps expertise with our hands-on learning
        approach.
      </h1>
      <p className="jss131 text-[#AFB3B8] text-lg">
        Our program is designed to empower you with the tools and techniques
        essential for mastering DevOps practices. From automation to streamlined
        deployment, our expert-led courses offer real-world scenarios for
        practical insights.
      </p>
      <div className="container grid gap-4 grid-cols-2">
        <div className="grid grid-cols-1 gap-4">
          {labs.map((lab: ILandLab, i: number) => (
            <div
              onClick={() => handleLabClick(lab)}
              key={i}
              className={`
              jss135 text-sm cursor-pointer relative shadow-xl bg-gray-900 border   h-full overflow-hidden rounded-2xl
              ${
                currentLab.value === lab.value
                  ? "border-slate-300 "
                  : "border-gray-800"
              }
      
              `}
            >
              {lab.icon}
              {lab.label}
            </div>
          ))}
        </div>

        <div className="relative bg-gray-900 shadow-xl  border border-gray-800   overflow-hidden rounded-2xl h-[500px] flex flex-col">
          <div className="jss138 p-2 bg-black/80">
            <div className="jss139 ">
              <div className="w-[20px] h-[20px] ">{currentLab.sm_icon}</div>
              {currentLab.file_name}
            </div>
          </div>
          <div className="overflow-scroll  ">
            <pre className="text-sm ">
              <code
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              ></code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codes;
<div className=" w-full relative ">
  <div className="absolute inset-0 h-full w-full  transform scale-[0.80] rounded-full blur-3xl" />
  <div className="relative shadow-xl bg-[0_0%_98%] border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start"></div>
</div>;
