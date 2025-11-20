import tkinter as tk
from tkinter import ttk, messagebox
import json
import random
import os

# ===== Load responses from JSON =====
def load_responses():
    try:
        with open("responses.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        messagebox.showerror("Error", "responses.json not found!")
        return {}

responses = load_responses()

# ===== Core Logic =====
def translate_vcc():
    mood = mood_var.get().strip()
    phrase = phrase_entry.get().strip()

    if not phrase:
        messagebox.showwarning("Oops!", "Enter your phrase first!")
        return

    if mood in responses:
        output = random.choice(responses[mood])
        output_var.set(output)
    else:
        output_var.set("Translation failed. Mood not in database!")

# ===== UI Setup =====
root = tk.Tk()
root.title("Vibe-Check-Conditional (VCC)")
root.geometry("520x400")
root.config(bg="#1e1e1e")

# ===== Fonts & Style =====
style = ttk.Style()
style.configure("TLabel", background="#1e1e1e", foreground="#00ff99", font=("Consolas", 11))
style.configure("TButton", background="#00ff99", foreground="#1e1e1e", font=("Consolas", 10, "bold"))
style.configure("TEntry", fieldbackground="#333", foreground="#00ff99")

# ===== Widgets =====
ttk.Label(root, text="Vibe-Check-Conditional ⚡", font=("Consolas", 16, "bold")).pack(pady=10)

ttk.Label(root, text="Enter your phrase:").pack()
phrase_entry = ttk.Entry(root, width=50)
phrase_entry.pack(pady=5)

ttk.Label(root, text="Select your friend's mood:").pack(pady=5)
mood_var = tk.StringVar()
mood_dropdown = ttk.Combobox(root, textvariable=mood_var, values=list(responses.keys()), width=47)
mood_dropdown.pack(pady=5)

ttk.Button(root, text="Translate", command=translate_vcc).pack(pady=10)

output_var = tk.StringVar()
output_label = ttk.Label(root, textvariable=output_var, wraplength=480, font=("Consolas", 11))
output_label.pack(pady=20)

# ===== Re-roll button =====
def reroll():
    mood = mood_var.get().strip()
    if mood in responses:
        output_var.set(random.choice(responses[mood]))
    else:
        output_var.set("No mood selected or mood invalid!")

ttk.Button(root, text="Re-Roll 🎲", command=reroll).pack(pady=5)

# ===== Run App =====
root.mainloop()
