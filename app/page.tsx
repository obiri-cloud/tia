"use client";
import React, { useEffect, useRef, useState } from "react";
import Hero from "./components/home/hero";
import Courses from "./components/home/courses";
import Stats from "./components/home/stats";
import Provisioning from "./components/home/provisioning";
import OtherStats from "./components/home/otherstats";
import Footer from "./components/home/footer";
import Navbar from "@/components/ui/navbar";
import Link from "next/link";
import ThemeToggle from "./components/home/themetoggle";
import lab from "@/public/images/lab.png";
import Image from "next/image";
import azure from "@/public/svgs/azure.svg";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";

import "prismjs/components/prism-hcl";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import yaml from "highlight.js/lib/languages/yaml";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("yaml", yaml);

const Page = () => {
  const code = `
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

  const highlightedK8sCode = hljs.highlight(k8s_code, {
    language: "yaml",
  }).value;

  

  const elementRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const elementHeight = rect.bottom - rect.top;
    const threshold = windowHeight * 0.9; // 20% visibility threshold

    return rect.bottom - threshold <= windowHeight && rect.top + threshold >= 0;
  };

  const handleScroll = () => {
    if (elementRef.current && isInViewport(elementRef.current)) {
      setIsInView(true);
      window.removeEventListener("scroll", handleScroll);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check if element is in view on initial render

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      title: "<=30 seconds spin-up time",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "60 minutes labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "2 free labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "10+ labs",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
    {
      title: "4+ cloud providers supported",
      text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis culpa assumenda excepturi minus aliquid! Cupiditate odio, ad dolore vitae consequatur et voluptas. Ex esse mollitia culpa laboriosam, veniam impedit explicabo?",
    },
  ];

  const labs = [
    {
      label: "Terraform",
      value: "terraform",
      icon: <i className="devicon-terraform-plain  colored text-[40px]"></i>,
    },
    {
      label: "K8s",
      value: "k8s",
      icon: <i className="devicon-kubernetes-plain colored text-[40px]"></i>,
    },
    {
      label: "ArgoCD",
      value: "argo-cd",
      icon: <i className="devicon-argocd-plain colored text-[40px]"></i>,
    },
    {
      label: "Bash Scripting",
      value: "bash",
      icon: <i className="devicon-bash-plain  dark:colored text-[40px]"></i>,
    },
    {
      label: "Ansible",
      value: "ansible",
      icon: <i className="devicon-ansible-plain dark:colored text-[40px]"></i>,
    },
  ];

  useEffect(() => {
    setTimeout(() => Prism.highlightAll(), 0);
  }, []);
  return (
    <div className="relative font-sans flex flex-col w-full leading-[1.53em]">
      <div className="header-sticky-wrapper ">
        <header className="header-sticky">
          <a href="/" className="header-logo"></a>
          <nav className="header-nav">
            <a
              className="header-link login-link"
              target="_blank"
              href="https://app.hyperping.io/login"
            >
              Log in
            </a>
            <a
              className="header-link signup-link text-pink-500"
              target="_blank"
              href="https://app.hyperping.io/register"
            >
              Sign up
            </a>
          </nav>
        </header>
      </div>
      <main className="Layout_content__PrPCk">
        <div className="cJPsz">
          <div className="LayoutContent_root__ZBUya">
            <div className="  hAvAAJ htlrgj">
              <h1 className="cmVMmT bzZmGu">
                Be a better DevOps
                <br /> Engineer with Tialabs
              </h1>
              <p className=" icTiAa fpOzFb haagJq">
                Empower Your Skills, Embrace Efficiency:
                <br /> Hands-On Learning for DevOps Mastery at Your Fingertips.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mt-[100px]">
          <section className="iAlLYX">
            <div
              ref={elementRef}
              className={`gpARPD fcRICy visible`}
              style={{
                transform: isInView ? "rotateX(0deg)" : "rotateX(25deg)", // Apply transform based on isInView
              }}
            >
              <div className="fqsAX"></div>
              <div className="llNjPV">
                <div
                  data-orientation="horizontal"
                  // style="--size: 86; --duration: 1797;"
                  className="ddawYB"
                ></div>
              </div>
              <svg
                width="100%"
                viewBox="0 0 1499 778"
                fill="none"
                className="sc-ae73eb3-5 dkEHDs"
              >
                <path pathLength="1" d="M1500 72L220 72"></path>
                <path pathLength="1" d="M1500 128L220 128"></path>
                <path pathLength="1" d="M1500 189L220 189"></path>
                <path pathLength="1" d="M220 777L220 1"></path>
                <path pathLength="1" d="M538 777L538 128"></path>
              </svg>
              <Image
                alt="Screenshot of the Linear app showing the sidebar for the Encom workspace and a few of their projects in the roadmap."
                // className="sc-a3de4d09-0 tcnjh sc-ae73eb3-7 gKMVY"
                src={lab}
              />
            </div>
          </section>
        </div>

        <div className="container">
          <h2 className="text-[22px] font-normal text-center jykcho">
            Choose from our multiple cloud providers.
          </h2>
          <div className="flex gap-[100px] justify-center">
            <div className="">
              <i className="devicon-azure-plain-wordmark text-[150px] jykcho"></i>
            </div>
            <div className="">
              <i className="devicon-googlecloud-plain-wordmark text-[150px] jykcho"></i>
            </div>
            <div className="">
              <i className="devicon-amazonwebservices-plain-wordmark text-[150px] jykcho"></i>
            </div>
            <div className="">
              <i className="devicon-digitalocean-plain-wordmark text-[130px] jykcho"></i>
            </div>
          </div>
        </div>
        <div
          data-orientation="horizontal"
          role="separator"
          className="sc-4b9cd1f9-0 eZWIgh"
        ></div>
        <section className="keyfeatures container">
          <h3
            style={{
              maxWidth: "650px",
              margin: "auto",
              marginBottom: "40px",
            }}
            className="sc-734624b2-0 sc-6bdb0090-1 dytDgx dMeTup mb-5 jykcho"
          >
            Tialabs dominates the market competition with its unmatched
            features, setting a new standard for excellence.
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {features.map((feat, i) => (
              <div key={i} className="keyfeatures-blocks">
                <div>
                  <span>
                    <h4 className="font-jet mb-2">{feat.title}</h4>
                    <p className="text-sm">{feat.text}</p>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div
          data-orientation="horizontal"
          role="separator"
          className="sc-4b9cd1f9-0 eZWIgh"
        ></div>

        <div className="">
          <h1 className="jss26 jss130 max-w-[950px]">
            Provision anything and everything with Terraform-defined workspaces
          </h1>
          <p className="jss131 text-[#AFB3B8] text-lg">
            Write normal Terraform that runs our startup script on provisioned
            compute. A development environment may consist of any Terraform
            resource, including virtual machines, containers, Kubernetes pods,
            or non-computing resources like secrets and databases.
          </p>
          <div className="container grid gap-4 grid-cols-2">
            <div className="grid grid-cols-1 gap-4">
              {labs.map((lab, i) => (
                <div key={i} className="jss135 ">
                  {lab.icon}
                  {lab.label}
                </div>
              ))}
            </div>
            <div className="jss137">
              <div className="jss138">
                <div className="jss139">main.tf</div>
              </div>
              <div className="overflow-scroll px-2">
              
                <pre className="px-2">
                  <code
                    dangerouslySetInnerHTML={{ __html: highlightedK8sCode }}
                  ></code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div
          data-orientation="horizontal"
          role="separator"
          className="sc-4b9cd1f9-0 eZWIgh"
        ></div>

        <div className="LayoutContent_root__ZBUya">
          <div className="sc-aebfa4d0-0 glNtfm">
            <p className=" dJZbCQ block text-[120px]">∞</p>
            <div className="sc-aebfa4d0-0 jHMutq">
              <h2 className="sc-734624b2-0 sc-6bdb0090-0 sc-f69e4342-1 dJZbCQ exmcmE hwNsAr text-[70px] transform-none">
                Learn for tomorrow
                <br />
                Learn devops today.
              </h2>
            </div>
          </div>
        </div>
      </main>
      {/* <Hero />
      <Courses />
      <Provisioning />
      <OtherStats />
      <Footer />

      <ThemeToggle /> */}
    </div>
  );
};

export default Page;
