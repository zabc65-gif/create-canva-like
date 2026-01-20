#!/usr/bin/env python3
import ftplib
import os
from pathlib import Path
import time

# Configuration FTP
FTP_HOST = "ftp.sc6pixv7011.universe.wf"
FTP_USER = "CreateBueBe@create.myziggi.pro"
FTP_PASS = "CreateBueBe79$"
LOCAL_DIR = "/Users/user/Documents/Développement/Create(Canva-like)/frontend/dist"

def upload_file(ftp, local_file, remote_file):
    """Upload a single file"""
    try:
        with open(local_file, 'rb') as file:
            ftp.storbinary(f'STOR {remote_file}', file)
        return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

def ensure_dir(ftp, path):
    """Ensure a directory exists"""
    dirs = path.split('/')
    current = ''
    for d in dirs:
        if d:
            current += ('/' if current else '') + d
            try:
                ftp.cwd(current)
            except:
                try:
                    ftp.mkd(current)
                    ftp.cwd(current)
                except:
                    pass

def main():
    print(f"🚀 Deploying to {FTP_HOST}...")

    try:
        # Connect
        ftp = ftplib.FTP(timeout=60)
        ftp.set_pasv(True)
        ftp.connect(FTP_HOST, 21)
        ftp.login(FTP_USER, FTP_PASS)

        print(f"✓ Connected")

        # Get initial directory
        start_dir = ftp.pwd()
        print(f"✓ Starting directory: {start_dir}")

        # Upload all files
        local_path = Path(LOCAL_DIR)
        files_uploaded = 0
        files_failed = 0

        for item in sorted(local_path.rglob('*')):
            if item.is_file():
                relative_path = item.relative_to(local_path)
                remote_path = str(relative_path).replace('\\', '/')

                # Go back to start directory
                ftp.cwd(start_dir)

                # Create directory if needed
                remote_dir = str(Path(remote_path).parent).replace('\\', '/')
                if remote_dir and remote_dir != '.':
                    ensure_dir(ftp, remote_dir)
                    ftp.cwd(start_dir)

                # Upload file
                print(f"Uploading {relative_path}... ", end='', flush=True)

                # Change to target directory
                if remote_dir and remote_dir != '.':
                    ftp.cwd(remote_dir)

                filename = Path(remote_path).name
                if upload_file(ftp, item, filename):
                    print("✓")
                    files_uploaded += 1
                else:
                    print("✗")
                    files_failed += 1

        # Close
        ftp.quit()

        print(f"\n✅ Deployment completed!")
        print(f"   Files uploaded: {files_uploaded}")
        if files_failed > 0:
            print(f"   Files failed: {files_failed}")
        print(f"\n🌐 Site: https://create.myziggi.pro")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
