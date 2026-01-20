#!/usr/bin/env python3
import ftplib
import os
from pathlib import Path
import time

# Configuration FTP
FTP_HOST = "ftp.cluster030.hosting.ovh.net"
FTP_USER = "ziggi-create"
FTP_PASS = "e98kHUxZbv9ksq"
FTP_REMOTE_DIR = "www"
LOCAL_DIR = "/Users/user/Documents/Développement/Create(Canva-like)/frontend/dist"

def upload_file(ftp, local_file, remote_file):
    """Upload a single file with retry logic"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            with open(local_file, 'rb') as file:
                ftp.storbinary(f'STOR {remote_file}', file)
            return True
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"  Retry {attempt + 1}/{max_retries}...")
                time.sleep(2)
            else:
                print(f"  Failed after {max_retries} attempts: {e}")
                return False

def main():
    print(f"🚀 Connecting to {FTP_HOST}...")

    try:
        # Connect to FTP with passive mode
        ftp = ftplib.FTP(timeout=60)
        ftp.set_pasv(True)  # Force passive mode

        print(f"Connecting...")
        ftp.connect(FTP_HOST, 21)

        print(f"Logging in as {FTP_USER}...")
        ftp.login(FTP_USER, FTP_PASS)

        print(f"✓ Connected successfully!")
        print(f"Server: {ftp.getwelcome()}")

        # Change to remote directory
        print(f"Changing to directory: {FTP_REMOTE_DIR}")
        ftp.cwd(FTP_REMOTE_DIR)
        print(f"✓ Current directory: {ftp.pwd()}")

        # Upload files
        local_path = Path(LOCAL_DIR)
        files_uploaded = 0
        files_failed = 0

        for item in sorted(local_path.rglob('*')):
            if item.is_file():
                relative_path = item.relative_to(local_path)
                remote_path = str(relative_path).replace('\\', '/')

                # Create directories if needed
                remote_dir = str(Path(remote_path).parent).replace('\\', '/')
                if remote_dir != '.':
                    try:
                        ftp.cwd(f"{FTP_REMOTE_DIR}/{remote_dir}")
                    except:
                        # Create directory structure
                        dirs = remote_dir.split('/')
                        current = FTP_REMOTE_DIR
                        for d in dirs:
                            if d and d != '.':
                                try:
                                    ftp.mkd(f"{current}/{d}")
                                except:
                                    pass
                                current += f"/{d}"

                # Go back to base directory
                ftp.cwd(FTP_REMOTE_DIR)

                # Upload file
                print(f"Uploading {relative_path}... ", end='', flush=True)
                remote_full_path = f"{FTP_REMOTE_DIR}/{remote_path}"

                if upload_file(ftp, item, remote_full_path):
                    print("✓")
                    files_uploaded += 1
                else:
                    print("✗")
                    files_failed += 1

        # Close connection
        ftp.quit()

        print(f"\n✅ Deployment completed!")
        print(f"   Files uploaded: {files_uploaded}")
        if files_failed > 0:
            print(f"   Files failed: {files_failed}")

    except ftplib.error_perm as e:
        print(f"\n❌ FTP Permission Error: {e}")
        print("\nPossible causes:")
        print("1. Wrong username or password")
        print("2. FTP account is locked or disabled")
        print("3. IP address is blocked")
        print("\nPlease check your OVH control panel to:")
        print("- Verify FTP credentials")
        print("- Check if FTP account is active")
        print("- Reset password if needed")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
