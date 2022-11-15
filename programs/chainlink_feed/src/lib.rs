use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chainlink_solana as chainlink;

declare_id!("BjxRX7HBxAkJr1ty6sS53bqkL4kon28zSZgjTUKqyg8j");

#[program]
pub mod chainlink_feed {
    

    use super::*;

    pub fn get_sol_price(ctx: Context<GetSolPrice>) -> ProgramResult {
        
        let round = chainlink::latest_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info()
        )?;

        let result_account = &mut ctx.accounts.result_account;
        result_account.value = round.answer;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct GetSolPrice<'info> {
    #[account(init, payer=user, space=100)]
    pub result_account: Account<'info, ResultAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK:
    pub chainlink_program: AccountInfo<'info>,
    /// CHECK:
    pub chainlink_feed: AccountInfo<'info>
}

#[account]
pub struct ResultAccount {
    pub value: i128
}
