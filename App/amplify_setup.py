"""
A script to automate the setup of an Amplify app with a Next.js SSR project.

Steps:
1. Ensure all of your code is in a github repository.
2. Download and setup the AWS cli if it's not already installed.
    - Download using this link: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    - Run `aws configure` and enter your AWS credentials
2. Create a new OAuth token in github with the repo hooks permission. 
    - Go to: https://github.com/settings/tokens
    - Generate a classic token and select the appropriate permissions
3. Run this script with the required arguments:
    python3 amplify_setup.py \
        --name "AppTemplate" \
        --repository_url "https://github.com/1851-labs/AppTemplate" \
        --oauth_token <TOKEN_EHERE> 
4. The deployment will fail. Go to the Amplify console and manually delete the environment
    variable AMPLIFY_MONOREPO_APP_ROOT, and re-add it.
5. In the AWS Amplify web console, press the redeploy button to trigger a new deployment.
"""

import json
import subprocess
import argparse

import boto3
import yaml

def main(args):
    region = args.region
    name = args.name
    description = args.description
    repository_url = args.repository_url
    oauth_token = args.oauth_token
    branch = args.branch
    framework = "Next.js - SSR"

    # Initialize the Amplify client
    client = boto3.client('amplify', region_name=region)
    # Create the Amplify app
    response = client.create_app(
        name=name,
        description=description,
        repository=repository_url,
        accessToken=oauth_token,
    )
    # Extract the app ID
    app_id = response['app']['appId']
    print(f"Amplify App ID: {app_id}")
    # Create a branch in the Amplify app
    response = client.create_branch(
        appId=app_id,
        branchName=branch,
        description='The main branch of the repo'
    )
    # Read the yml build config
    with open('amplify.yml', 'r') as f:
        build_spec = yaml.safe_load(f)
        build_spec_json = json.dumps(build_spec)
    # Update the branch with the build settings and environment variables
    def load_environment_variables(file_path):
        """Load environment variables from a file into a dictionary."""
        env_vars = {}
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line and not line.startswith('#'):  # Skip empty lines and comments
                    key, value = line.split('=', 1)
                    value = value.split(' ')[0]
                    env_vars[key] = value.strip('"').strip("'")  # Remove possible quotes
        
        if 'AMPLIFY_MONOREPO_APP_ROOT' not in env_vars:
            env_vars['AMPLIFY_MONOREPO_APP_ROOT'] = '/App'
        return json.dumps(env_vars, indent=4)
    # Specify the path to your env.local file
    env_file_path = '.env.local'
    # Load environment variables from the specified file
    env_vars = load_environment_variables(env_file_path)

    command = [
        "aws", "amplify", "update-branch",
        "--app-id", app_id,
        "--branch-name", branch,
        "--build-spec", f"file://amplify.yml",
        "--region", region,
        "--enable-auto-build",
        "--environment-variables", env_vars
    ]
    print(env_vars)
    # Execute the command using subprocess
    result = subprocess.run(command, capture_output=True, text=True)
    # Check for errors and print the result
    if result.returncode != 0:
        raise Exception(f"Error updating build spec: {result.stderr}")
    # response = client.update_branch(
    #     appId=app_id,
    #     branchName=branch,
    #     buildSpec=build_spec_json,
    #     enableAutoBuild=True,
    #     environmentVariables={
    #         "AMPLIFY_MONOREPO_APP_ROOT": "/App"
    #     }
    # )
    # Setup SSR
    response = client.update_app(
        appId=app_id,
        platform='WEB_COMPUTE'  # Equivalent to --platform WEB_COMPUTE
    )
    # Update the branch
    response = client.update_branch(
        appId=app_id,
        branchName=branch,
        framework=framework
    )
    # Trigger a deployment for the specified branch
    response = client.start_job(
        appId=app_id,
        branchName=branch,
        jobType='RELEASE'  # To deploy the latest changes from the repository
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Amplify Setup Script")
    parser.add_argument("--region", type=str, help="AWS region", default="us-east-2")
    parser.add_argument("--name", type=str, help="App name", required=True)
    parser.add_argument("--description", type=str, help="App description", default="")
    parser.add_argument("--repository_url", type=str, help="Repository URL", required=True)
    parser.add_argument("--oauth_token", type=str, help="Get this from github. Ensure that permission is given for repo hooks", required=True,)
    parser.add_argument("--branch", type=str, help="Branch name", default="main")
    args = parser.parse_args()
    main(args)