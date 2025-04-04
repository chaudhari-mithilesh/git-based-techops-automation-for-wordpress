#!/bin/bash

# Exit on error
set -e

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error function
error() {
    echo "[ERROR] $(date +'%Y-%m-%d %H:%M:%S')] $1" >&2
    exit 1
}

# Create necessary directories
log "Creating documentation directories..."
mkdir -p docs/docx docs/templates

# Make scripts executable
log "Making scripts executable..."
chmod +x scripts/convert-docs.sh

# Install dependencies
log "Installing dependencies..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install pandoc
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo apt-get update
    sudo apt-get install -y pandoc
else
    error "Unsupported operating system"
fi

# Create reference template
log "Creating reference template..."
cat > docs/templates/reference.docx << 'EOL'
# This is a binary file and cannot be created directly through text editing.
# Please create a new Word document with the following styles:

# Heading 1
- Font: Arial
- Size: 24pt
- Color: #2C3E50
- Bold
- Space before: 24pt
- Space after: 12pt

# Heading 2
- Font: Arial
- Size: 18pt
- Color: #34495E
- Bold
- Space before: 18pt
- Space after: 9pt

# Heading 3
- Font: Arial
- Size: 14pt
- Color: #7F8C8D
- Bold
- Space before: 12pt
- Space after: 6pt

# Normal Text
- Font: Arial
- Size: 11pt
- Color: #2C3E50
- Line spacing: 1.15
- Space after: 6pt

# Code Block
- Font: Courier New
- Size: 10pt
- Color: #2C3E50
- Background: #F8F9FA
- Border: 1pt solid #E9ECEF
- Indent: 0.5in
- Space before: 6pt
- Space after: 6pt

# Table of Contents
- Font: Arial
- Size: 11pt
- Color: #2C3E50
- Indent: 0.25in per level
- Space before: 12pt
- Space after: 6pt

# Links
- Color: #3498DB
- Underline
EOL

# Run conversion script
log "Converting documentation to DOCX..."
./scripts/convert-docs.sh

log "Documentation setup completed successfully!" 