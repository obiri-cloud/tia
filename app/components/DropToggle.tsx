import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const themes = [
  {
    value: "dark",
    label: (
      <span>
        <div className="sc-hLBbgP jouEsA">
          <div className="sc-gMHJKX GATXs">
            <span className="sc-bcXHqe sc-csNZvx cvSnkm jlBvVU">Aa</span>
          </div>
          <span className="sc-bcXHqe sc-cxiiTX clfcKZ dvLDyp">Dark</span>
        </div>
      </span>
    ),
  },
  {
    value: "light",
    label: (
      <span>
        <div className="sc-hLBbgP jouEsA">
          <div className="sc-gMHJKX GATXs">
            <span className="sc-bcXHqe sc-csNZvx cvSnkm dnrtPT">Aa</span>
          </div>
          <span className="sc-bcXHqe sc-cxiiTX chGwny dvLDyp">Light</span>
        </div>
      </span>
    ),
  },
];

export const DropToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(theme);

  useEffect(() => {
    setValue(theme);
  }, []);

  return (
    <>
      <div className="sc-jEJXZe cyvxRV"></div>

      <div className="sc-hLBbgP cAyNtX ">
        <div className="sc-hLBbgP gUrCBj">
          <span className="text-left leading-8 text-2xl font-medium tracking-widest-[-0.01rem] dark:text-dashboardDarkHeadText whiteDark">
            Display
          </span>
        </div>
        <div className="sc-bcXHqe sc-cRIgaW cpMQpB htAZxf">
          Manage your theme and colors
        </div>
      </div>
      <div className="border-b dark:border-b-dashboardDarkSeparator border-b-whiteEdge my-6"></div>
      <div className="">
        <span className=" text-whiteDark text-[1.125rem] dark:text-dashboardDarkHeadText font-medium block mb-4 text-left ">
          Theme
        </span>
        <div className="sc-hLBbgP sc-islFiG ioYMmf ">
          <div className="sc-hLBbgP gUrCBj">
            <div className="sc-hLBbgP sc-eAeVAz dIPdRh hOuTWu">
              <label className="text-[0.8125rem] text-whiteDark dark:text-dashboardDarkHeadText font-medium ml-[2px] mr-[4px] inline-block text-left">
                Interface theme
              </label>
              <span className="sc-bcXHqe sc-iuxOeI wRSCb jhSxJJ">
                Select or customize your interface color scheme.
              </span>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between dark:bg-comboBg bg-white theme-selector"
                >
                  {value
                    ? themes.find((theme) => theme.value === value)?.label
                    : "Select theme..."}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandEmpty>No themes found.</CommandEmpty>
                  <CommandGroup className="dark:bg-comboBg bg-white">
                    {themes.map((theme) => (
                      <CommandItem
                        key={theme.value}
                        value={theme.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                          setTheme(theme.value);
                        }}
                        className="capitalize"
                      >
                        {theme.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === theme.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};
