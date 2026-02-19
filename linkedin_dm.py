import pyperclip
import webbrowser
import time

def generate_message(recruiter_name, company, role, location):
    # Professional, data-driven opening
    intro = f"Hi {recruiter_name},"
    
    # Value proposition
    value_prop = (
        f"I'm Rohan, a Solutions Architect with 6+ years of experience in automotive E/E systems "
        f"(3 OEMs, 5+ platforms). "
    )
    
    # Specific hook
    if role:
        hook = f"I noticed the {role} role"
    else:
        hook = "I noticed opportunities"
        
    if company:
        hook += f" at {company}"
        
    if location:
        hook += f" in {location}"

    # Call to action & Links
    closing = (
        f" and believe my expertise in AUTOSAR, ISO 26262, and MBSE would be a great fit.\n\n"
        f"My portfolio: https://rohankadam.com\n"
        f"Resume: https://rohankadam.com/Rohan_Kadam_Resume_v2.docx\n\n"
        f"Best,\nRohan"
    )

    return f"{intro}\n\n{value_prop}{hook}{closing}"

def main():
    print("--------------------------------------------------")
    print("   LINKEDIN DM AUTOMATION - ROHAN KADAM SCRIPT    ")
    print("--------------------------------------------------")
    
    name = input("Recruiter Name: ").strip()
    company = input("Company (Optional): ").strip()
    role = input("Job Role (Optional): ").strip()
    location = input("Location (Optional): ").strip()
    profile_url = input("LinkedIn Profile URL (Optional): ").strip()

    print("\nGenerating message...")
    time.sleep(0.5)
    
    message = generate_message(name, company, role, location)
    
    print("\n------------------- PREVIEW -------------------")
    print(message)
    print("--------------------------------------------------")
    
    try:
        pyperclip.copy(message)
        print("\n✅ Message copied to CLIPBOARD!")
    except Exception as e:
        print(f"\n⚠️ Could not copy to clipboard: {e}")
        print("Please copy the message manually.")

    if profile_url:
        print(f"Opening {profile_url}...")
        webbrowser.open(profile_url)
    else:
        print("Opening LinkedIn Messaging...")
        webbrowser.open("https://www.linkedin.com/messaging/")
        
    print("\nDone! Paste (Ctrl+V) and send. 🚀")

if __name__ == "__main__":
    main()
