---
sidebar_position: 3
title: OneKhusa Tools
description: OneKhusa MCP tools reference
---

# OneKhusa Tools (18)

MCP tools for OneKhusa payment operations.

## Collections (3 tools)

### Initiate Request-to-Pay

Request payment from a customer.

**Example prompts:**
- *"Request a payment of 5000 MWK from 265991234567 using OneKhusa"*
- *"Initiate a OneKhusa collection for 10000 MWK"*

### Get Collection Transactions

List collection transactions.

**Example prompts:**
- *"Show my OneKhusa collections"*
- *"Get completed OneKhusa transactions"*

### Get Transaction Details

Get details for a specific collection.

**Example prompts:**
- *"Check status of OneKhusa collection COL_12345"*

## Single Disbursements (5 tools)

### Add Single Disbursement

Create a payout to one recipient.

**Example prompts:**
- *"Create a OneKhusa disbursement of 10000 MWK to John Doe at 265991234567"*
- *"Send a single payout via OneKhusa"*

### Approve Disbursement

Approve a pending disbursement.

**Example prompts:**
- *"Approve OneKhusa disbursement DIS_12345"*

### Review Disbursement

Mark a disbursement as reviewed.

**Example prompts:**
- *"Review disbursement DIS_12345"*

### Reject Disbursement

Reject a disbursement.

**Example prompts:**
- *"Reject disbursement DIS_12345 because of incorrect details"*

### Get Disbursement Details

Check disbursement status.

**Example prompts:**
- *"Get status of disbursement DIS_12345"*

## Batch Disbursements (9 tools)

### Add Batch Disbursement

Create a batch with multiple recipients.

**Example prompts:**
- *"Create a batch disbursement for January salaries with 3 recipients totaling 150000 MWK"*
- *"Start a OneKhusa batch payout"*

### Approve Batch

Approve a batch for processing.

**Example prompts:**
- *"Approve batch BATCH_12345"*

### Review Batch

Mark a batch as reviewed.

**Example prompts:**
- *"Review batch BATCH_12345"*

### Reject Batch

Reject a batch.

**Example prompts:**
- *"Reject batch BATCH_12345 - budget not approved"*

### Cancel Batch

Cancel a batch.

**Example prompts:**
- *"Cancel batch BATCH_12345"*

### Transfer Batch Funds

Process payment for an approved batch.

**Example prompts:**
- *"Transfer funds for batch BATCH_12345"*
- *"Process batch BATCH_12345"*

### Get All Batches

List your batches.

**Example prompts:**
- *"Show my OneKhusa batches"*
- *"Get all pending batches"*

### Get Batch Details

Get details for a specific batch.

**Example prompts:**
- *"Get details for batch BATCH_12345"*

### Get Batch Transactions

List transactions within a batch.

**Example prompts:**
- *"Show transactions in batch BATCH_12345"*

## Config (1 tool)

### Check Service Status

Check OneKhusa connectivity.

**Example prompts:**
- *"Is OneKhusa working?"*
- *"Check OneKhusa service status"*
