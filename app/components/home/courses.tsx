import { Button } from "@/components/ui/button";
import React from "react";

const Courses = () => {
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
  return (
    <section className="dark:bg-[#06000f] bg-white">
      <div className="lg:grid block grid-cols-2 container gap-4 py-5">
      <div className="flex flex-col  justify-center lg:mb-0 mb-6">
        <h2 className="md:text-[2rem] text-2xl font-bold dark:text-white text-black">
          Tia Cloud Presents Tialabs
        </h2>
        <p className="dark:text-white text-black">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
          deserunt, maxime molestiae itaque similique iste officia repudiandae
          voluptatibus ex. Similique accusamus, non mollitia delectus dolores
          omnis error perferendis laborum tempore!
        </p>
        <Button
          className="px-[50px] mt-6 dark:bg-white bg-black dark:text-black text-white w-fit "
          variant="outline"
        >
          View Labs
        </Button>
      </div>
      <div className="">
        {/* dark:bg-gradient-to-r from-darkGlass to-darkGlass */}
        <div className="glassBorder  md:rounded-[20px] rounded-lg md:p-8 p-4 dark:bg-[#0d1117] bg-white">
          <p className="dark:text-white text-black ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            {labs.map((lab, i: number) => (
              <div
                key={i}
                className="glassBorder rounded-lg p-3 flex gap-4  items-center dark:text-white text-black"
              >
                {lab.icon}
                <p>{lab.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Courses;
